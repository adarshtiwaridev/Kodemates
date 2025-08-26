const contactus=require("../Models/Contactus");
// create a new contact us message

exports.createContactus=async(req,res)=>{
    try {
        const { firstName, lastName, email, message } = req.body;

        if (!firstName || !lastName || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
   
        // create contact us message
        const newMessage = await contactus.create({
            firstName,
            lastName,
            email,
            message
        });

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        });
         
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
// get all contact us messages


exports.getAllMessages=async(req,res)=>{
    try {
        const messages = await contactus.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "All messages fetched successfully",
            data: messages
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



