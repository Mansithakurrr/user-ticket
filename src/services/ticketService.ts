// src/services/ticketService.ts
import Ticket from '@/models/Ticket';
import Counter from '@/models/Counter';
// Helper function to get the next sequence for serialNumber
async function getNextFormattedSerialNumber(): Promise<string> {
  console.log("SERVICE: Attempting to find/update counter with name: 'ticket'");
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'ticket' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    
    if (!counter || typeof counter.value === 'undefined') {
      console.error("SERVICE CRITICAL: Counter not found or 'value' field is missing!");
      throw new Error("Failed to retrieve or update ticket serial number counter.");
    }
    
    const nextSequence = counter.value;
    // Format the serial number (e.g., T-00001)
    const plainSerialNumber = String(nextSequence);
    console.log("SERVICE: Generated plain serialNumber:", plainSerialNumber);
    return plainSerialNumber;

  } catch (error) {
    console.error("SERVICE Error in getNextFormattedSerialNumber:", error);
    throw error;
  }
}

export async function createTicket(data: any) {
  try {
    // 1. Get next serial number from Counter collection
    const counter = await Counter.findOneAndUpdate(
      { name: 'ticket' },
      { $inc: { value: 1 } }, // ✅ Use `value`
      { new: true, upsert: true }
    );

    if (!counter || typeof counter.value !== 'number') {
      console.error("SERVICE CRITICAL: Counter not found or 'value' field is missing!");
      throw new Error("Failed to retrieve or update ticket serial number counter.");
    }

    const nextSequence = counter.value;
    const serialNumber = `${nextSequence.toString()}`;

    // 2. Inject into ticket before save
    const ticket = new Ticket({
      ...data,
      serialNumber,
    });

    await ticket.save();
    return ticket;
  } catch (error) {
    console.error("SERVICE Error in createTicket:", error);
    throw error;
  }
}


// export const createTicket = async (ticketData: any) => {
//   // This function now expects ticketData WITHOUT serialNumber.
//   // It will generate the serialNumber itself.
//   console.log("SERVICE: createTicket received initial data:", ticketData);
//   try {
//     const serialNumber = await getNextFormattedSerialNumber();
    
//     const ticketPayload = { 
//       ...ticketData, 
//       serialNumber: serialNumber 
//       // Remove 'days' if not explicitly provided by form and not required with default in schema
//     };
//     // Remove days from payload if it's NaN or not needed
//     if (isNaN(ticketPayload.days)) {
//         delete ticketPayload.days;
//     }


//     console.log("SERVICE: Payload to be saved (with serialNumber):", ticketPayload);
    
//     const ticket = new Ticket(ticketPayload);
//     const savedTicket = await ticket.save();
//     console.log("SERVICE: Successfully saved ticket:", savedTicket);
//     return savedTicket;
//   } catch (error) {
//     console.error("SERVICE Error in createTicket:", error);
//     throw error;
//   }
// };

