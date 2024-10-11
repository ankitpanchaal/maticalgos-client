import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const OrderBookModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Book</DialogTitle>
        </DialogHeader>
        <div>
          {/* Order book content will go here */}
          <p>Order book content placeholder</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderBookModal;
