const fs = require('fs');
let txt = fs.readFileSync('src/components/project/GanttChart.tsx', 'utf8');

// 1. Initial tasks mapping
txt = txt.replace('const [fases, setFases] = useState(FASES_INIT);', 
`const FASES_INIT_DATES = FASES_INIT.map(f => ({
  ...f,
  tarefas: f.tarefas.map(t => ({...t, inicio: new Date(f.inicio), fim: new Date(f.fim), baseInicio: new Date(f.baseInicio), baseFim: new Date(f.baseFim)}))
}));
  const [fases, setFases] = useState(FASES_INIT_DATES);`);

// 2. Add recalcularCronograma helper
const helper = `function recalcularCronograma(fases) {
  let changed = true;
  let currentFases = [...fases];
  // Simple iteration to avoid infinite loops, max 100 passes
  let pass = 0;
  while (changed && pass < 100) {
    changed = false;
    pass++;
    currentFases = currentFases.map(f => {
      if (!f.deps || f.deps.length === 0) return f;
      const prevFases = currentFases.filter(pf => f.deps.includes(pf.id));
      if (prevFases.length === 0) return f;
      const maxDepFim = new Date(Math.max(...prevFases.map(pf => pf.fim)));
      // allow next phase to start on the next day
      const expectedInicio = addDays(maxDepFim, 1);
      if (f.inicio < expectedInicio) {
        const diff = diffDays(f.inicio, expectedInicio);
        if (diff > 0) {
          changed = true;
          const newTarefas = f.tarefas.map(t => ({ ...t, inicio: addDays(t.inicio, diff), fim: addDays(t.fim, diff) }));
          return { ...f, inicio: addDays(f.inicio, diff), fim: addDays(f.fim, diff), tarefas: newTarefas };
        }
      }
      return f;
    });
  }
  return currentFases;
}
`;
txt = txt.replace('export default function GanttPro() {', helper + '\nexport default function GanttPro() {');

// 3. Update Drag logic
const oldDrag = `      setFases(prev => prev.map(f => {
        if (f.id !== faseId) return f;
        if (tipo === "move") return { ...f, inicio: addDays(origInicio, dd), fim: addDays(origFim, dd) };
        if (tipo === "left") { const ni = addDays(origInicio, dd); return ni < f.fim ? { ...f, inicio: ni } : f; }
        if (tipo === "right") { const nf = addDays(origFim, dd); return nf > f.inicio ? { ...f, fim: nf } : f; }
        return f;
      }));`;
const newDrag = `      setFases(prev => {
        const afterMove = prev.map(f => {
          if (f.id !== faseId) return f;
          let ni = origInicio, nf = origFim;
          if (tipo === "move") { ni = addDays(origInicio, dd); nf = addDays(origFim, dd); }
          if (tipo === "left") { ni = addDays(origInicio, dd); if (ni >= f.fim) ni = f.inicio; }
          if (tipo === "right") { nf = addDays(origFim, dd); if (nf <= f.inicio) nf = f.fim; }
          
          const diffMove = diffDays(f.inicio, ni);
          // if dragged, tasks also move
          const newTarefas = f.tarefas.map(t => ({ ...t, inicio: addDays(t.inicio, diffMove), fim: addDays(t.fim, diffMove) }));
          return { ...f, inicio: ni, fim: nf, tarefas: newTarefas };
        });
        return recalcularCronograma(afterMove);
      });`;
txt = txt.replace(oldDrag, newDrag);

// 4. Update saveTarefa
const oldSaveTarefa = `  const saveTarefa = (faseId, tarefa) => {
    setFases(prev => prev.map(f => {
      if (f.id !== faseId) return f;
      const exists = f.tarefas.find(t => t.id === tarefa.id);
      return {
        ...f,
        tarefas: exists
          ? f.tarefas.map(t => t.id === tarefa.id ? tarefa : t)
          : [...f.tarefas, { ...tarefa, id: newId() }],
      };
    }));
    setModalTarefa(null);
  };`;
const newSaveTarefa = `  const saveTarefa = (faseId, tarefa) => {
    setFases(prev => {
      let next = prev.map(f => {
        if (f.id !== faseId) return f;
        const exists = f.tarefas.find(t => t.id === tarefa.id);
        const newTarefas = exists
          ? f.tarefas.map(t => t.id === tarefa.id ? tarefa : t)
          : [...f.tarefas, { ...tarefa, id: newId(), baseInicio: new Date(tarefa.inicio), baseFim: new Date(tarefa.fim) }];
        
        const minInicio = newTarefas.length > 0 ? new Date(Math.min(...newTarefas.map(t => t.inicio))) : f.inicio;
        const maxFim = newTarefas.length > 0 ? new Date(Math.max(...newTarefas.map(t => t.fim))) : f.fim;
        
        return { ...f, tarefas: newTarefas, inicio: minInicio, fim: maxFim };
      });
      return recalcularCronograma(next);
    });
    setModalTarefa(null);
  };`;
txt = txt.replace(oldSaveTarefa, newSaveTarefa);

// 5. Update Task Rendering
const oldTaskRender = `{expanded[fase.id] && fase.tarefas.map((t, j) => {
                      const tTop = rowTop + ROW_H + j * 32 + 10;
                      const ts = STATUS_MAP[t.status] || STATUS_MAP.nao_iniciado;
                      return (
                        <div key={t.id} style={{
                          position: "absolute", top: tTop, left: x, width: w, height: 12,
                          background: ts.color + "22", border: \`1px solid \${ts.color}55\`, borderRadius: 3,
                        }}>
                          <div style={{ width: \`\${t.progresso}%\`, height: "100%", background: ts.color + "66", borderRadius: 3 }} />
                        </div>
                      );
                    })}`;
const newTaskRender = `{expanded[fase.id] && fase.tarefas.map((t, j) => {
                      const tTop = rowTop + ROW_H + j * 32 + 10;
                      const ts = STATUS_MAP[t.status] || STATUS_MAP.nao_iniciado;
                      const tx = dateToPx(t.inicio);
                      const tw = Math.max(dateToPx(t.fim) - tx + zoom.cellPx, 10);
                      const tAtraso = diffDays(t.baseFim, t.fim) > 0;
                      return (
                        <div key={t.id} style={{
                          position: "absolute", top: tTop, left: tx, width: tw, height: 12,
                          background: ts.color + "22", border: \`1px solid \${tAtraso ? "#ef4444" : ts.color}55\`, borderRadius: 3,
                          boxShadow: tAtraso ? "0 0 6px #ef444466" : "none"
                        }}>
                          {tAtraso && <div title="Tarefa em atraso" style={{position: "absolute", left: -18, top: -2, fontSize: 10, color: "#ef4444"}}>⚠</div>}
                          <div style={{ width: \`\${t.progresso}%\`, height: "100%", background: ts.color + "66", borderRadius: 3 }} />
                        </div>
                      );
                    })}`;
txt = txt.replace(oldTaskRender, newTaskRender);

// 6. Update TarefaModal function decl
const oldTarefaModal = `// ═══════════════ Modal de Tarefa ══════════════════════════════════════════════
function TarefaModal({ faseId, tarefa, onSave, onClose }) {
  const [nome, setNome] = useState(tarefa?.nome || "");
  const [status, setStatus] = useState(tarefa?.status || "nao_iniciado");
  const [progresso, setProgresso] = useState(tarefa?.progresso ?? 0);

  const submit = () => {
    if (!nome) return;
    onSave(faseId, { ...(tarefa || {}), nome, status, progresso: Number(progresso) });
  };`;
const newTarefaModal = `// ═══════════════ Modal de Tarefa ══════════════════════════════════════════════
function TarefaModal({ faseId, tarefa, onSave, onClose }) {
  const [nome, setNome] = useState(tarefa?.nome || "");
  const [inicio, setInicio] = useState(tarefa?.inicio ? tarefa.inicio.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
  const [fim, setFim] = useState(tarefa?.fim ? tarefa.fim.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState(tarefa?.status || "nao_iniciado");
  const [progresso, setProgresso] = useState(tarefa?.progresso ?? 0);

  function fromInput(s) { const [y, m, day] = s.split("-").map(Number); return new Date(y, m - 1, day); }

  const submit = () => {
    if (!nome || !inicio || !fim) return;
    onSave(faseId, { ...(tarefa || {}), nome, inicio: fromInput(inicio), fim: fromInput(fim), status, progresso: Number(progresso) });
  };`;
txt = txt.replace(oldTarefaModal, newTarefaModal);

// 7. Update TarefaModal inputs
const oldTarefaModalInputs = `<Field label="Nome da tarefa"><input value={nome} onChange={e => setNome(e.target.value)} style={inputStyle} placeholder="Ex: Configurar ambiente" /></Field>
      <Field label="Status">`;
const newTarefaModalInputs = `<Field label="Nome da tarefa"><input value={nome} onChange={e => setNome(e.target.value)} style={inputStyle} placeholder="Ex: Configurar ambiente" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Início"><input type="date" value={inicio} onChange={e => setInicio(e.target.value)} style={inputStyle} /></Field>
        <Field label="Fim"><input type="date" value={fim} onChange={e => setFim(e.target.value)} style={inputStyle} /></Field>
      </div>
      <Field label="Status">`;
txt = txt.replace(oldTarefaModalInputs, newTarefaModalInputs);

fs.writeFileSync('src/components/project/GanttChart.tsx', txt);
console.log('patched2');
