const Client = require('../models/Client');
const jwt = require('jsonwebtoken');
const { billMail } = ('../src/utils/mail.js');
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

// -------------------------- authenticate --------------------------

exports.authenticate = async(req, res) => {

    const { bin, password } = req.body;

    !bin || !password ? res.status(400).json({ message: 'Bin and password are required' }) : null;

    const foundClient = await Client.findOne({ bin, password });
    
    if (!foundClient) {
        res.status(404).send({ message:'user not found !' })
    }else{

        const token = jwt.sign(
            { id: foundClient._id, bin:foundClient.bin, password:foundClient.password },
            `${process.env.JWT_SECRET_KEY}`,
            {
                expiresIn: "1h",
            }
        );
        
        res
          .status(200)
          .send({
            token,
            sold: foundClient.sold,
            id: foundClient._id,
            bin: foundClient.bin,
            password: foundClient.password,
            message: 'You logged in successfully',
          });
        // session.set('token', token);
    }

}

// -------------------------- phoneBill --------------------------

exports.phoneBill = async(req, res) => {

    const { bill ,phoneNum } = req.body;
    try {
        
        const foundClient = await Client.findOne({ phone: phoneNum });

        if (!foundClient) {
            res.status(404).send({ message:"User's not correct !" })
        }else{

            if (foundClient.sold > bill) {

                let newSold = await foundClient.sold - bill

                Client.findByIdAndUpdate(foundClient._id, { sold: newSold }, { new: true }, (err, client) => {

                    if (err) {
                        res.status(400).send({ error: err });
                    } else {

                        // -------------------------- sending mail --------------------------

                        let mailTransporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                              user: process.env.EMAIL,
                              pass: process.env.PASSWORD,
                            },
                        })
                          
                        const handlebarOptions = {
                            viewEngine: {
                              extName: '.handlebars',
                              partialsDir: './src/utils/',
                              defaultLayout: false,
                            },
                            viewPath: './src/utils/',
                            extName: '.hbs',
                        }
                        mailTransporter.use('compile', hbs(handlebarOptions))
                          let mailDetails = {
                            from: process.env.EMAIL,
                            to: foundClient.email,
                            subject: 'Bill payment',
                            template: 'password',
                            context: {
                              name:foundClient.name ,
                              bill:bill,
                            },
                        }
                          
                        mailTransporter.sendMail(mailDetails, function (err, data) {
                            if (err) {
                                console.log('Error Occurs', err)
                            }else {
                                console.log('Email sent successfully', data)
                            }
                        })

                        res.status(200).send({ sold: client.sold, message: "You have successfully paid your phone bill" });
                    }

                });

            }else{
                res.status(400).send({ message: "broke ass nigga " });  
            } 
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}

// -------------------------- car tax --------------------------

exports.carTax= async(req, res) => {
    const { vehicleNumber, tax } = req.body;

    try {
        
        const foundClient = await Client.findOne({ vehicleNumber });
        if(!foundClient){
            res.status(404).send({ message:"User's not found !" })
        }else{

            if(foundClient.sold > tax){
                let newSold = await foundClient.sold - tax
                Client.findByIdAndUpdate(foundClient._id, { sold: newSold }, { new: true }, (err, client) => {
                    if (err) {
                        res.status(400).send({ error: err });
                    } else {
                        res.status(200).send({ sold: client.sold, message: "You have successfully paid your car tax" });
                    }
                });
            }else{
                res.status(400).send({ message: "You don't have enough money " });  
            }

        }

    } catch (error) {
        
    }
}

// -------------------------- Ticket --------------------------

exports.ticket = async(req, res) => {
    const { bill, email, from ,to } = req.body;

    try {
        
        const foundClient = await Client.findOne({ email });
        if(!foundClient){
            res.status(404).send({ message:"User's email not found !" })
        }else{
            
            if(foundClient.sold > bill){
                let newSold = await foundClient.sold - bill
                Client.findByIdAndUpdate(foundClient._id, { sold: newSold }, { new: true }, (err, client) => {
                    if (err) {
                        res.status(400).send({ error: err });
                    } else {

                        // -------------------------- sending mail --------------------------

                        let transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.EMAIL,
                                pass: process.env.PASSWORD,
                            }
                        });
                          
                        let mailOptions = {
                            from: process.env.EMAIL,
                            to: foundClient.email,
                            subject: 'Your Ticket  ('+from+' to '+to+')',
                            text: 'Travel safe !'
                        };
                          
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                              console.log(error);
                            } else {
                              console.log('Email sent: ' + info.response);
                            }
                        });

                        res.status(200).send({ sold: client.sold, message: "You have successfully paid your ticket" });
                    }
                });
            }else{
                res.status(400).send({ message: "You don't have enough money " });  
            }

        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// -------------------------- recharge --------------------------

exports.recharge = async(req, res) => {
    const { amount, phoneNum } = req.body;

    try {
        
        const foundClient = await Client.findOne({ phone: phoneNum });
        if(!foundClient){
            res.status(404).send({ message:"User's phone number not found !" })
        }else{
            let newSold = await foundClient.sold - amount
            Client.findByIdAndUpdate(foundClient._id, { sold: newSold }, { new: true }, (err, client) => {
                if (err) {
                    res.status(400).send({ error: err });
                } else {
                    res.status(200).send({ sold: client.sold, message: "You have successfully recharge your phone" });
                }
            });
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}