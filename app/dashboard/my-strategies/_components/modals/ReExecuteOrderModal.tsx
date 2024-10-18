// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { OrderBookItem } from "../../types";
// import { useQuery } from "@tanstack/react-query";
// import { AccountResponse } from "@/app/dashboard/type";
// import { getAccount } from "@/app/dashboard/_actions";
// import { Switch } from "@/components/ui/switch";
// import Spinner from "@/components/shared/Spinner";

// type ReExecuteOrderModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   order: OrderBookItem | null;
// };

// export default function ReExecuteOrderModal({
//   isOpen,
//   onClose,
//   order,
// }: ReExecuteOrderModalProps) {
//   if (!order) return null;

//   const [transactionType, setTransactionType] = useState(
//     order.transType.toUpperCase() || "BUY"
//   );
//   const [orderType, setOrderType] = useState("LIMIT");
//   const [productType, setProductType] = useState("INTRADAY");
//   const [price, setPrice] = useState(order.price || "");
//   const [triggerPrice, setTriggerPrice] = useState(order.triggerPrice || "");
//   const [account, setAccount] = useState<string | null>(null);
//   const [timeLimit, setTimeLimit] = useState("1");
//   const [priceBuffer, setPriceBuffer] = useState("0");
//   const [shouldExecute, setShouldExecute] = useState(true);

//   const { isPending, data, isError } = useQuery<AccountResponse>({
//     queryKey: ["account"],
//     queryFn: getAccount,
//     retry: 2,
//   });

//   useEffect(() => {
//     if (data) {
//       setAccount(data.data[0].AccountName);
//     }
//   }, [data]);

//   useEffect(() => {
//     if (orderType === "MARKET") {
//       setPrice("");
//       setTriggerPrice("");
//     } else if (orderType === "LIMIT") {
//       setTriggerPrice("");
//     }
//   }, [orderType]);

//   const handleSubmit = () => {
//     console.log("Order modified", {
//       transactionType,
//       orderType,
//       productType,
//       price,
//       triggerPrice,
//       account,
//       timeLimit,
//       priceBuffer,
//       shouldExecute,
//     });
//     onClose();
//   };

//   const getHeaderColor = () => {
//     return transactionType === "BUY" ? "bg-green-200" : "bg-red-200";
//   };

//   if (isPending)
//     return (
//       <Dialog open={isOpen} onOpenChange={onClose}>
//         <DialogContent>
//           <div className="flex h-28 justify-center items-center">
//             <Spinner />
//           </div>
//         </DialogContent>
//       </Dialog>
//     );

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       {isError && !account ? (
//         <DialogContent className="w-full max-w-md">
//           <p>Error loading account details. Please try again later.</p>
//         </DialogContent>
//       ) : (
//         <DialogContent className="w-full max-w-md">
//           <DialogHeader>
//             <DialogTitle>Re-Execute Order</DialogTitle>
//           </DialogHeader>
//           <div
//             className={`flex justify-between items-center p-2  rounded ${getHeaderColor()}`}
//           >
//             <span>
//               {order.symbol} NFO:{order.token}
//             </span>
//             <span>{order.price}</span>
//           </div>
//           <div className="grid gap-4">
//             <div className="flex justify-between items-center">
//               <Label>Transaction Type:</Label>
//               <div className="flex">
//                 <Button
//                   variant={transactionType === "BUY" ? "default" : "outline"}
//                   onClick={() => setTransactionType("BUY")}
//                   className={`rounded-r-none ${
//                     transactionType === "BUY"
//                       ? "bg-green-500 hover:bg-green-600"
//                       : ""
//                   }`}
//                 >
//                   BUY
//                 </Button>
//                 <Button
//                   variant={transactionType === "SELL" ? "default" : "outline"}
//                   onClick={() => setTransactionType("SELL")}
//                   className={`rounded-l-none ${
//                     transactionType === "SELL"
//                       ? "bg-red-500 hover:bg-red-600"
//                       : ""
//                   }`}
//                 >
//                   SELL
//                 </Button>
//               </div>
//             </div>
//             <div className="flex justify-between items-center">
//               <Label>Order Type:</Label>
//               <div className="flex">
//                 <Button
//                   variant={orderType === "LIMIT" ? "default" : "outline"}
//                   onClick={() => setOrderType("LIMIT")}
//                   className={`rounded-r-none`}
//                 >
//                   LIMIT
//                 </Button>
//                 <Button
//                   variant={orderType === "MARKET" ? "default" : "outline"}
//                   onClick={() => setOrderType("MARKET")}
//                   className="rounded-none border-x-0"
//                 >
//                   MARKET
//                 </Button>
//                 <Button
//                   variant={orderType === "SL LIMIT" ? "default" : "outline"}
//                   onClick={() => setOrderType("SL LIMIT")}
//                   className={`rounded-l-none`}
//                 >
//                   SL LIMIT
//                 </Button>
//               </div>
//             </div>
//             <div className="flex justify-between items-center">
//               <Label>Product Type:</Label>
//               <div className="flex">
//                 <Button
//                   variant={productType === "INTRADAY" ? "default" : "outline"}
//                   onClick={() => setProductType("INTRADAY")}
//                   className={`rounded-r-none`}
//                 >
//                   INTRADAY
//                 </Button>
//                 <Button
//                   variant={productType === "DELIVERY" ? "default" : "outline"}
//                   onClick={() => setProductType("DELIVERY")}
//                   className={`rounded-l-none`}
//                 >
//                   DELIVERY
//                 </Button>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col space-y-1.5">
//                 <Label htmlFor="price">Price:</Label>
//                 <Input
//                   id="price"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                   disabled={orderType === "MARKET"}
//                 />
//               </div>
//               <div className="flex flex-col space-y-1.5">
//                 <Label htmlFor="triggerPrice">Trigger Price:</Label>
//                 <Input
//                   id="triggerPrice"
//                   value={triggerPrice}
//                   onChange={(e) => setTriggerPrice(e.target.value)}
//                   disabled={orderType !== "SL LIMIT"}
//                 />
//               </div>
//             </div>
//             <div className="flex justify-between items-center">
//               <Label htmlFor="account">Account:</Label>
//               <Select value={account || undefined} onValueChange={setAccount}>
//                 <SelectTrigger id="account" className="w-[120px]">
//                   <SelectValue placeholder="Select account" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value={data?.data[0].AccountName || ""}>
//                     {data?.data[0].AccountName}
//                   </SelectItem>
//                   <SelectItem value="All">All</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <Accordion
//               type="single"
//               hidden={orderType !== "LIMIT"}
//               collapsible
//               className={`w-full`}
//             >
//               <AccordionItem
//                 value="operations"
//                 disabled={orderType !== "LIMIT"}
//               >
//                 <AccordionTrigger
//                   className={`${
//                     orderType !== "LIMIT"
//                       ? "cursor-not-allowed"
//                       : "cursor-pointer"
//                   }`}
//                 >
//                   Operations
//                 </AccordionTrigger>
//                 <AccordionContent>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="flex flex-col space-y-1.5">
//                       <Label htmlFor="timeLimit">Time Limit:</Label>
//                       <Input
//                         id="timeLimit"
//                         value={timeLimit}
//                         onChange={(e) => setTimeLimit(e.target.value)}
//                       />
//                     </div>
//                     <div className="flex flex-col space-y-1.5">
//                       <Label htmlFor="priceBuffer">Price Buffer:</Label>
//                       <Input
//                         id="priceBuffer"
//                         value={priceBuffer}
//                         onChange={(e) => setPriceBuffer(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                   {/* <div className="flex justify-between items-center mt-4">
//                     <Label>Should Execute:</Label>
//                     <div className="flex">
//                       <Button
//                         variant={
//                           shouldExecute === "YES" ? "default" : "outline"
//                         }
//                         onClick={() => setShouldExecute("YES")}
//                         //   className={`rounded-r-none ${shouldExecute === "YES" ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}`}
//                       >
//                         YES
//                       </Button>
//                       <Button
//                         variant={shouldExecute === "NO" ? "default" : "outline"}
//                         onClick={() => setShouldExecute("NO")}
//                         //   className={`rounded-l-none ${shouldExecute === "NO" ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}`}
//                       >
//                         NO
//                       </Button>
//                     </div>
//                   </div> */}
//                   <div className="flex items-center space-x-2 mt-4">
//                     <Switch
//                       id="should-execute"
//                       checked={shouldExecute}
//                       onCheckedChange={() => setShouldExecute(!shouldExecute)}
//                     />
//                     <Label
//                       htmlFor="should-execute"
//                       className={`${
//                         shouldExecute ? "text-black" : "text-gray-600"
//                       }`}
//                     >
//                       Should Execute
//                     </Label>
//                   </div>
//                 </AccordionContent>
//               </AccordionItem>
//             </Accordion>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={onClose}>
//               CLOSE
//             </Button>
//             <Button onClick={handleSubmit}>MODIFY</Button>
//           </DialogFooter>
//         </DialogContent>
//       )}
//     </Dialog>
//   );
// }
