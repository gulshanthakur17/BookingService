const { StatusCodes } = require('http-status-codes');

const { BookingService } = require('../services/index');

const {createChannel , publishMessage } = require('../utils/message-queue');
const { REMINDER_BINDING_KEY} = require('../config/server-config');

const bookingService = new BookingService();

class BookingController {

    constructor(){
        
    }

    async sendMessageToQueue( req, res)  {

        const channel = await createChannel();
        const payload = {
            data: {
                subject: 'This is a Notification Queue',
                content: 'Some Queue will Suscribe this',
                recepientEmail: 'testingmail@gmail.com',
                notificationTime: '2023-09-30T09:21:00'
            },
            service: 'CREATE_TICKET'
        };
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
        return res.status(200).json({
            message: 'Successfully published the event'
        });

    }

    async create (req, res)  {
        try {
            const response = await bookingService.createBooking(req.body);
            console.log("FROM BOOKING CONTROLLER", response);
            return res.status(StatusCodes.OK).json({
                message: 'Successfully Completed Booking',
                success: true,
                err: {},
                data: response
            })
        
        } catch (error) {
            return res.status(error.statusCode).json ({
                message: error.message,
                success: false,
                err: error.explanation,
                data:{}
            });
        }
    
    }

}

module.exports = BookingController;