import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: "deploy" | "stop" | "squareOff" | null;
}> = ({ isOpen, onClose, onConfirm, action }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {action === "deploy"
              ? "Deploy Strategy"
              : action === "stop"
              ? "Stop Strategy"
              : "Square Off Strategy"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {action === "deploy"
              ? "Are you sure you want to deploy this strategy?"
              : action === "stop"
              ? "Are you sure you want to stop this strategy?"
              : "Are you sure you want to square off this strategy?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
