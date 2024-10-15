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
  actionButtonLabel?: string;
  action: "deploy" | "stop" | "squareOff" | "unsubscribe" | "account_status" | null;
}> = ({ isOpen, onClose, onConfirm, action,actionButtonLabel }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {action === "deploy"
              ? "Deploy Strategy"
              : action === "stop"
              ? "Stop Strategy"
              : action === "squareOff"
              ? "Square Off Strategy"
              : action === "account_status" ? "Account Status"
              : "Unsubscribe Strategy"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {action === "deploy"
              ? "Are you sure you want to deploy this strategy?"
              : action === "stop"
              ? "Are you sure you want to stop this strategy?"
              : action === "squareOff"
              ? "Are you sure you want to square off this strategy?"
              : action === "account_status" ? "Are you sure you want to change the account status?"
              : "Are you sure you want to unsubscribe this strategy?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`${
              action === "deploy"
                ? "bg-green-500 hover:bg-green-500"
                : action === "stop"
                ? "bg-red-500 hover:bg-red-500"
                : action === "squareOff"
                ? "bg-yellow-500 hover:bg-yellow-500"
                : action === "unsubscribe" ? "bg-red-500 hover:bg-red-500" :"bg-primary"
            }`}
          >
            {actionButtonLabel ? actionButtonLabel : action === "deploy"
              ? "Deploy"
              : action === "stop"
              ? "Stop"
              : action === "squareOff"
              ? "Square Off"
              : "Unsubscribe"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
