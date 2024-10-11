import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ChartModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chart</DialogTitle>
        </DialogHeader>
        <div>
          {/* Chart content will go here */}
          <p>Chart content placeholder</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChartModal;
