import fs from 'node:fs/promises';
import { Presentation, PresentationFile } from '@oai/artifact-tool';

const ROOT = 'C:/Users/Ronaldo/Desktop/Projectflow/project-flow';
const OUT = `${ROOT}/docs/ProjectFlow_Documentacao_Landing_Experimentacao_V2.pptx`;
const QA = `${ROOT}/.tmp/ppt-landing-v2/qa`;
const deck = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const C = { ink:'#111318', muted:'#5F6672', panel:'#F0F1F3', rule:'#C4C8CF', purple:'#6D5BD0', pale:'#E9E6FA', blue:'#3D8DFF', green:'#20A464', amber:'#E19A22', red:'#D94B4B', white:'#FFFFFF', dark:'#111318' };
deck.theme.colorScheme = { name:'ProjectFlow', themeColors:{ accent1:C.purple,accent2:C.blue,accent3:C.green,accent4:C.amber,accent5:C.red,accent6:'#8892A0',bg1:C.white,bg2:C.panel,tx1:C.ink,tx2:C.muted,dk1:'#000000',dk2:C.ink,lt1:C.white,lt2:C.panel,hlink:C.blue,folHlink:C.purple } };

function text(slide, value, x, y, w, h, size=20, o={}) {
  const s=slide.shapes.add({geometry:'textbox',name:o.name,position:{left:x,top:y,width:w,height:h},fill:'none',line:{style:'solid',fill:'none',width:0}});
  s.text=value; s.text.style={fontSize:size,typeface:'Arial',color:o.color||C.ink,bold:!!o.bold,alignment:o.align||'left',verticalAlignment:o.vAlign||'top',autoFit:'shrinkText'}; return s;
}
function rect(slide,x,y,w,h,fill,o={}) { return slide.shapes.add({geometry:o.geometry||'rect',name:o.name,position:{left:x,top:y,width:w,height:h},fill,line:{style:'solid',fill:o.line||fill,width:o.lineWidth??0},borderRadius:o.radius}); }
function rule(slide,x,y,w,color=C.rule,width=1) { return slide.shapes.add({geometry:'line',position:{left:x,top:y,width:w,height:0},fill:'none',line:{style:'solid',fill:color,width}}); }
function header(slide,title,num,section='NOVA LANDING · DOCUMENTAÇÃO FUNCIONAL') { text(slide,section,42,30,740,28,15,{bold:true,color:C.purple}); text(slide,title,42,70,1150,70,36,{bold:true}); rule(slide,42,145,1196); text(slide,String(num).padStart(2,'0'),1178,650,60,34,13,{align:'right',color:C.muted}); }
function sources(slide,items) { slide.speakerNotes.textFrame.setText(`[Sources]\n${items.map(i=>`- ${i}`).join('\n')}\n[/Sources]`); }
function bullets(slide,items,x,y,w,{size=20,gap=58,color=C.ink,marker=C.purple}={}) { items.forEach((v,i)=>{ rect(slide,x,y+i*gap,10,10,marker,{geometry:'ellipse'}); text(slide,v,x+28,y-8+i*gap,w-28,48,size,{color}); }); }
function label(slide,value,x,y,w=150,color=C.purple) { text(slide,value.toUpperCase(),x,y,w,26,15,{bold:true,color}); }

// 1 Cover
{
 const s=deck.slides.add(); s.background.fill=C.white;
 text(s,'PROJECTFLOW',42,40,360,30,18,{bold:true,color:C.purple});
 text(s,'Landing de\nexperimentação',42,166,760,180,66,{bold:true});
 text(s,'Documentação funcional e técnica ampliada',42,390,700,50,28,{color:C.muted});
 text(s,'Objetivo · experiência · regras · arquitetura · qualidade · evolução',42,470,780,60,20,{color:C.muted});
 rect(s,1010,40,228,228,C.purple); text(s,'PF',1010,82,228,110,68,{bold:true,color:C.white,align:'center',vAlign:'middle'});
 text(s,'Versão 2 · 06 agosto 2026',42,640,500,26,15,{bold:true,color:C.muted});
 sources(s,['docs/superpowers/specs/2026-08-06-landing-experimentacao-design.md']);
}

// 2 Executive summary
{
 const s=deck.slides.add(); s.background.fill=C.white; header(s,'A funcionalidade reduz a distância entre interesse e uso',2);
 label(s,'Objetivo',42,186); text(s,'Comunicar valor executivo e levar o visitante diretamente à experiência real do ProjectFlow.',42,220,690,80,25,{bold:true});
 label(s,'Público',42,338); text(s,'Diretores, gestores de projetos e responsáveis por portfólio que precisam acompanhar risco, prazo e alocação.',42,372,690,96,21,{color:C.muted});
 rect(s,810,185,386,365,C.pale,{line:C.purple,lineWidth:1});
 text(s,'Conversão desta versão',846,220,310,36,22,{bold:true,color:C.purple});
 text(s,'/dashboard',846,286,310,80,52,{bold:true});
 text(s,'Sem cobrança\nSem formulário\nSem cadastro obrigatório',846,392,310,112,22,{color:C.muted});
 text(s,'Decisão de produto',42,548,230,30,16,{bold:true,color:C.purple}); text(s,'Demonstrar antes de vender.',270,542,600,42,26,{bold:true});
 sources(s,['docs/superpowers/specs/2026-08-06-landing-experimentacao-design.md']);
}

// 3 Change rationale
{
 const s=deck.slides.add(); s.background.fill=C.white; header(s,'O redesenho removeu barreiras e alegações sem evidência',3);
 const rows=[['Preço e checkout','Experimentação direta'],['Urgência promocional','Proposta de valor'],['Popup obrigatório','Acesso sem cadastro'],['Promessas genéricas','Benefícios observáveis'],['“Project Flow”','Marca padronizada: ProjectFlow']];
 text(s,'EXPERIÊNCIA ANTERIOR',42,178,490,28,16,{bold:true,color:C.red}); text(s,'NOVA EXPERIÊNCIA',690,178,490,28,16,{bold:true,color:C.green});
 rows.forEach((r,i)=>{const y=226+i*72; text(s,r[0],58,y,480,34,21,{color:C.muted}); text(s,'→',620,y,40,34,22,{bold:true,color:C.purple,align:'center'}); text(s,r[1],706,y,470,34,21,{bold:true}); rule(s,42,y+44,1154,C.rule);});
 text(s,'Resultado',42,604,150,28,16,{bold:true,color:C.purple}); text(s,'Menos fricção, mais coerência com o estágio atual do produto.',190,598,980,40,23,{bold:true});
 sources(s,['src/pages/Landing.tsx','docs/superpowers/specs/2026-08-06-landing-experimentacao-design.md']);
}

// 4 Value proposition
{
 const s=deck.slides.add(); s.background.fill=C.white; header(s,'A mensagem conecta dados do projeto a decisões executivas',4);
 text(s,'“Transforme projetos em decisões previsíveis”',42,180,900,58,32,{bold:true,color:C.purple});
 const chain=[['Prazos','Quando esperamos entregar?'],['Riscos','O que pode desviar o plano?'],['Progresso','Quanto já foi realizado?'],['Alocação','Quem está atuando em quê?']];
 chain.forEach((c,i)=>{const x=42+i*300; text(s,`0${i+1}`,x,286,48,28,16,{bold:true,color:C.purple}); text(s,c[0],x,324,260,38,25,{bold:true}); text(s,c[1],x,380,250,76,19,{color:C.muted});});
 rule(s,42,474,1158,C.rule,2);
 text(s,'Leitura resultante',42,512,240,28,16,{bold:true,color:C.purple});
 text(s,'Onde agir agora — e o que esperar das próximas entregas.',280,502,880,50,27,{bold:true});
 sources(s,['src/pages/Landing.tsx']);
}

// 5 Page anatomy
{
 const s=deck.slides.add(); s.background.fill=C.white; header(s,'Cinco blocos conduzem a narrativa sem dispersar a atenção',5);
 const blocks=[['1','Cabeçalho','Marca, âncoras, Entrar e CTA'],['2','Hero','Promessa, contexto, CTA e prévia'],['3','Benefícios','Quatro resultados de negócio'],['4','Como funciona','Planeje, acompanhe e decida'],['5','Fechamento','Reforço de valor e CTA final']];
 blocks.forEach((b,i)=>{const y=180+i*86; rect(s,42,y,78,58,i===1?C.purple:C.ink); text(s,b[0],42,y+10,78,30,20,{bold:true,color:C.white,align:'center',vAlign:'middle'}); text(s,b[1],158,y+4,250,36,24,{bold:true}); text(s,b[2],430,y+5,660,34,20,{color:C.muted}); text(s,i<4?'continua':'converte',1090,y+6,108,28,15,{bold:true,color:i<4?C.muted:C.green,align:'right'}); if(i<4)rule(s,158,y+63,1040);});
 sources(s,['src/pages/Landing.tsx']);
}

// 6 Header and hero details
{
 const s=deck.slides.add(); s.background.fill=C.white; header(s,'Cabeçalho e hero resolvem orientação, mensagem e ação',6);
 label(s,'Cabeçalho',42,180); bullets(s,['Marca “ProjectFlow” volta ao início.','Âncoras levam a Benefícios e Como funciona.','Entrar e Experimentar grátis abrem /dashboard.'],42,230,550,{size:19,gap:66});
 label(s,'Hero',660,180); bullets(s,['Identifica gestão orientada por dados.','Apresenta a promessa de previsibilidade.','Explica prazo, risco, progresso e alocação.','Exibe CTA principal e “sem cadastro”.'],660,230,540,{size:19,gap:66,marker:C.blue});
 rect(s,42,520,1156,80,C.pale,{line:C.purple,lineWidth:1}); text(s,'Regra de decisão',66,538,220,30,18,{bold:true,color:C.purple}); text(s,'Uma única ação de produto: experimentar o dashboard.',300,530,850,45,25,{bold:true});
 sources(s,['src/pages/Landing.tsx']);
}

// 7 Preview evidence model
{
 const s=deck.slides.add(); s.background.fill=C.white; header(s,'A prévia demonstra o tipo de leitura entregue pelo produto',7);
 const items=[['3','Projetos ativos','Dimensão do portfólio em acompanhamento'],['68%','Progresso médio','Visão consolidada da execução'],['2','Riscos críticos','Pontos que exigem atenção'],['6','Profissionais','Capacidade alocada nos projetos']];
 items.forEach((it,i)=>{const x=42+(i%2)*590; const y=190+Math.floor(i/2)*196; text(s,it[0],x,y,160,64,46,{bold:true,color:i===2?C.amber:C.purple}); text(s,it[1],x+168,y+8,390,36,24,{bold:true}); text(s,it[2],x+168,y+56,390,58,18,{color:C.muted}); rule(s,x,y+134,540);});
 text(s,'Importante',42,594,140,26,16,{bold:true,color:C.red}); text(s,'A composição é ilustrativa e não simula controles interativos.',180,588,920,38,22,{bold:true});
 sources(s,['src/pages/Landing.tsx']);
}

// 8 Benefits decision matrix
{
 const s=deck.slides.add(); s.background.fill=C.white; header(s,'Cada benefício responde a uma pergunta de gestão',8);
 const cols=[42,405,780]; text(s,'BENEFÍCIO',cols[0],178,320,28,15,{bold:true,color:C.purple}); text(s,'PERGUNTA RESPONDIDA',cols[1],178,340,28,15,{bold:true,color:C.purple}); text(s,'DECISÃO APOIADA',cols[2],178,410,28,15,{bold:true,color:C.purple});
 const rows=[['Previsibilidade','Quando entregaremos?','Repriorizar prazo ou escopo'],['Riscos antecipados','O que ameaça a entrega?','Tratar impedimentos primeiro'],['Alocação transparente','Quem está em cada frente?','Realocar atenção e responsabilidade'],['Decisões data-driven','Onde agir agora?','Priorizar com evidência consolidada']];
 rows.forEach((r,i)=>{const y=226+i*94; text(s,r[0],cols[0],y,320,58,20,{bold:true}); text(s,r[1],cols[1],y,330,58,19,{color:C.muted}); text(s,r[2],cols[2],y,410,58,19); rule(s,42,y+66,1156);});
 sources(s,['docs/superpowers/specs/2026-08-06-landing-experimentacao-design.md']);
}

// 9 Journey and navigation
{
 const s=deck.slides.add(); s.background.fill=C.white; header(s,'A navegação preserva contexto e evita becos sem saída',9);
 const steps=[['Chegada','/'],['Exploração','#beneficios'],['Entendimento','#como-funciona'],['Ação','/dashboard']];
 rule(s,105,320,1040,C.ink,2);
 steps.forEach((st,i)=>{const x=90+i*340; const tx=i===3?980:x; const tw=i===3?160:260; const align=i===3?'right':'left'; rect(s,x,306,28,28,i===3?C.purple:C.ink,{geometry:'ellipse'}); text(s,`0${i+1}`,i===3?1080:x,246,60,30,16,{bold:true,color:C.purple,align}); text(s,st[0],tx,370,tw,36,24,{bold:true,align}); text(s,st[1],tx,416,tw,34,20,{color:C.muted,align});});
 text(s,'Comportamento comum',42,542,260,28,16,{bold:true,color:C.purple}); text(s,'Todos os CTAs navegam na mesma aba; não há popup, checkout ou redirecionamento externo.',300,532,870,64,21,{bold:true});
 sources(s,['src/pages/Landing.tsx','src/App.tsx']);
}

// 10 Routing matrix
{
 const s=deck.slides.add(); s.background.fill=C.white; header(s,'O contrato de navegação é explícito e testável',10);
 const x=[42,360,650,950]; ['ELEMENTO','DESTINO','TIPO','RESULTADO'].forEach((h,i)=>text(s,h,x[i],178,i===3?250:260,26,15,{bold:true,color:C.purple}));
 const rows=[['Marca','#inicio','Âncora','Volta ao hero'],['Benefícios','#beneficios','Âncora','Exibe resultados'],['Como funciona','#como-funciona','Âncora','Exibe fluxo'],['Entrar','/dashboard','Rota interna','Abre produto'],['Experimentar grátis','/dashboard','Rota interna','Abre produto']];
 rows.forEach((r,i)=>{const y=224+i*72; r.forEach((v,j)=>text(s,v,x[j],y,j===3?250:260,42,j===0?20:18,{bold:j===0,color:j===1?C.purple:(j>1?C.muted:C.ink)})); rule(s,42,y+48,1156);});
 text(s,'Sem integração externa nesta versão.',42,612,600,32,18,{bold:true,color:C.green});
 sources(s,['src/pages/Landing.tsx','src/pages/Landing.test.tsx']);
}

// 11 Responsive behavior
{
 const s=deck.slides.add(); s.background.fill=C.white; header(s,'Responsividade preserva a prioridade do conteúdo',11);
 const modes=[['Desktop','Hero em duas colunas','Prévia ao lado da mensagem','Navegação completa'],['Tablet','Hero reorganizado','Cards em duas colunas','Espaços preservados'],['Celular','Fluxo em uma coluna','Prévia abaixo do CTA','Sem overflow horizontal']];
 modes.forEach((m,i)=>{const x=42+i*411; text(s,m[0],x,188,360,44,27,{bold:true,color:i===0?C.purple:C.ink}); rule(s,x,246,355,i===0?C.purple:C.rule,3); text(s,m[1],x,286,350,44,20,{bold:true}); text(s,m[2],x,364,350,44,19,{color:C.muted}); text(s,m[3],x,442,350,44,19,{color:C.muted});});
 rect(s,42,544,1156,72,C.panel); text(s,'Critério de aceitação',66,562,250,26,16,{bold:true,color:C.purple}); text(s,'A experiência permanece legível e acionável em qualquer largura.',320,553,820,40,23,{bold:true});
 sources(s,['src/pages/Landing.tsx','src/pages/Landing.test.tsx']);
}

// 12 Accessibility
{
 const s=deck.slides.add(); s.background.fill=C.white; header(s,'Acessibilidade foi tratada como requisito funcional',12);
 const checks=[['Estrutura semântica','header, main, sections e footer'],['Nomes acessíveis','Links e ações comunicam sua finalidade'],['Prévia não interativa','role="img" com descrição explícita'],['Ícones decorativos','aria-hidden evita leitura redundante'],['Movimento reduzido','motion-reduce remove transformação'],['Foco por teclado','Componentes preservam foco visível']];
 checks.forEach((c,i)=>{const x=i%2===0?42:650; const y=188+Math.floor(i/2)*136; text(s,'✓',x,y,42,42,26,{bold:true,color:C.green}); text(s,c[0],x+52,y,520,34,22,{bold:true}); text(s,c[1],x+52,y+48,520,48,18,{color:C.muted});});
 text(s,'Validação automatizada',42,604,230,26,16,{bold:true,color:C.purple}); text(s,'Regiões estruturais e ilustração acessível fazem parte do contrato de teste.',268,596,920,42,21,{bold:true});
 sources(s,['src/pages/Landing.tsx','src/pages/Landing.test.tsx']);
}

// 13 Architecture and scope
{
 const s=deck.slides.add(); s.background.fill=C.white; header(s,'Arquitetura enxuta preserva o foco da funcionalidade',13);
 label(s,'Implementação',42,180); bullets(s,['Landing.tsx concentra conteúdo e composição.','Arrays locais descrevem benefícios e passos.','React Router conecta a página ao dashboard.','Tailwind, Lucide e Button já existentes são reutilizados.'],42,228,555,{size:18,gap:62});
 label(s,'Fora do escopo',670,180,180,C.red); bullets(s,['Autenticação e criação de conta.','Checkout, preço e planos comerciais.','Persistência de estado ou formulários.','Backend, analytics e dependências novas.'],670,228,530,{size:18,gap:62,marker:C.red});
 rect(s,42,538,1156,72,C.pale,{line:C.purple,lineWidth:1}); text(s,'Impacto técnico',66,556,190,26,16,{bold:true,color:C.purple}); text(s,'2 arquivos de produto/teste · 0 dependências · rota existente preservada',260,548,900,40,23,{bold:true});
 sources(s,['src/pages/Landing.tsx','src/App.tsx','docs/superpowers/specs/2026-08-06-landing-experimentacao-design.md']);
}

// 14 Traceability
{
 const s=deck.slides.add(); s.background.fill=C.white; header(s,'Os testes rastreiam os comportamentos essenciais',14);
 const rows=[['Proposta e benefícios','Título + 4 benefícios','PASS'],['CTAs do produto','Links para /dashboard','PASS'],['Navegação interna','2 âncoras + 3 passos','PASS'],['Remoção comercial','Sem preço, oferta ou diálogo','PASS'],['Prévia executiva','Ilustração sem controles falsos','PASS'],['Estrutura responsiva','Regiões + breakpoint do hero','PASS']];
 text(s,'COMPORTAMENTO',42,176,370,26,15,{bold:true,color:C.purple}); text(s,'EVIDÊNCIA DO TESTE',430,176,530,26,15,{bold:true,color:C.purple}); text(s,'STATUS',1045,176,145,26,15,{bold:true,color:C.purple,align:'right'});
 rows.forEach((r,i)=>{const y=218+i*66; text(s,r[0],42,y,370,38,18,{bold:true}); text(s,r[1],430,y,520,38,18,{color:C.muted}); text(s,r[2],1045,y,145,34,16,{bold:true,color:C.green,align:'right'}); rule(s,42,y+44,1156);});
 text(s,'Execução final',42,630,180,26,16,{bold:true,color:C.purple}); text(s,'6/6 testes da landing · 54/54 testes da suíte · build aprovado',220,622,900,38,21,{bold:true});
 sources(s,['src/pages/Landing.test.tsx','Evidência da execução do commit aaf67f9']);
}

// 15 Acceptance & next evolution
{
 const s=deck.slides.add(); s.background.fill=C.dark;
 text(s,'RESULTADO E EVOLUÇÃO',42,34,430,28,15,{bold:true,color:'#AFA3F0'}); text(s,'A landing está pronta para\nexperimentação — e para aprender.',42,104,950,128,48,{bold:true,color:C.white});
 text(s,'Entregue nesta versão',42,290,340,34,24,{bold:true,color:C.white}); bullets(s,['Mensagem executiva clara','Acesso direto ao dashboard','Responsividade e acessibilidade','Contrato automatizado'],42,344,480,{size:18,gap:54,color:'#D1D5DB',marker:'#AFA3F0'});
 text(s,'Próximas decisões',670,290,340,34,24,{bold:true,color:C.white}); bullets(s,['Medir cliques nos CTAs','Definir autenticação real','Validar conteúdo com usuários','Reintroduzir oferta somente com evidência'],670,344,530,{size:18,gap:54,color:'#D1D5DB',marker:C.green});
 text(s,'Princípio preservado: demonstrar valor antes de solicitar compromisso.',42,630,1100,34,22,{bold:true,color:'#AFA3F0'});
 sources(s,['docs/superpowers/specs/2026-08-06-landing-experimentacao-design.md','src/pages/Landing.tsx']);
}

await fs.mkdir(QA,{recursive:true});
for(const [i,s] of deck.slides.items.entries()){
 const png=await deck.export({slide:s,format:'png',scale:1}); await fs.writeFile(`${QA}/slide-${i+1}.png`,new Uint8Array(await png.arrayBuffer()));
 const layout=await s.export({format:'layout'}); await fs.writeFile(`${QA}/slide-${i+1}.layout.json`,await layout.text());
}
const montage=await deck.export({format:'webp',montage:{columns:3,slideWidth:426,gap:14,padding:14},scale:1}); await fs.writeFile(`${QA}/montage.webp`,new Uint8Array(await montage.arrayBuffer()));
const pptx=await PresentationFile.exportPptx(deck); await pptx.save(OUT); console.log(OUT);
