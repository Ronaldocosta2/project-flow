import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ticket, getTicketStatusLabel, getTicketStatusColor, getPriorityLabel, getPriorityColor } from '@/data/mockData';
import { MessageSquare, Clock, User, Hash } from 'lucide-react';

interface TicketDetailProps {
  ticket: Ticket;
  onClose: () => void;
}

const TicketDetail = ({ ticket, onClose }: TicketDetailProps) => {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
              <Hash className="w-3 h-3" /> {ticket.id}
            </span>
            <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded-full ${getTicketStatusColor(ticket.status)}`}>
              {getTicketStatusLabel(ticket.status)}
            </span>
            <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded-full ${getPriorityColor(ticket.priority)}`}>
              {getPriorityLabel(ticket.priority)}
            </span>
          </div>
          <DialogTitle className="text-xl leading-tight">{ticket.title}</DialogTitle>
          <DialogDescription className="mt-4 text-base text-foreground/80">
            {ticket.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-6 py-4 border-y border-border my-2">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><User className="w-4 h-4"/> Criado por</span>
              <span className="font-medium">{ticket.createdBy.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><User className="w-4 h-4"/> Responsável</span>
              <span className="font-medium">{ticket.assignee ? ticket.assignee.name : 'Não atribuído'}</span>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4"/> Criado em</span>
              <span className="font-medium">{new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4"/> Atualizado em</span>
              <span className="font-medium">{new Date(ticket.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={onClose}>Fechar</Button>
          <Button className="gap-2"><MessageSquare className="w-4 h-4" /> Adicionar Comentário</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetail;
