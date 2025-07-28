const { Schedule, Availability } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');

class ScheduleService {
  async createSchedule(scheduleData) {
    const { startTime, endTime, clientName } = scheduleData;
    
    try {
      // Start a transaction
      const result = await sequelize.transaction(async (t) => {
        // Check if the time slot is available
        const conflictingSchedule = await Schedule.findOne({
          where: {
            [Op.or]: [
              {
                startTime: {
                  [Op.between]: [startTime, endTime]
                }
              },
              {
                endTime: {
                  [Op.between]: [startTime, endTime]
                }
              }
            ],
            status: 'booked'
          },
          transaction: t
        });

        if (conflictingSchedule) {
          throw new Error('Time slot is already booked');
        }

        // Check if the time is within availability
        const dayOfWeek = new Date(startTime).getDay();
        const timeStart = new Date(startTime).toTimeString().slice(0, 8);
        const timeEnd = new Date(endTime).toTimeString().slice(0, 8);

        const availability = await Availability.findOne({
          where: {
            dayOfWeek,
            startTime: {
              [Op.lte]: timeStart
            },
            endTime: {
              [Op.gte]: timeEnd
            }
          },
          transaction: t
        });

        if (!availability) {
          throw new Error('Time slot is outside of available hours');
        }

        // Create the schedule
        const schedule = await Schedule.create({
          startTime,
          endTime,
          clientName
        }, { transaction: t });

        return schedule;
      });

      return result;
    } catch (error) {
      logger.error('Error creating schedule:', error);
      throw error;
    }
  }

  async getAvailableTimes(date) {
    try {
      const dayOfWeek = new Date(date).getDay();
      
      // Get availability for the day
      const availability = await Availability.findAll({
        where: { dayOfWeek }
      });

      // Get booked schedules for the day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const bookedSchedules = await Schedule.findAll({
        where: {
          startTime: {
            [Op.between]: [startOfDay, endOfDay]
          },
          status: 'booked'
        },
        order: [['startTime', 'ASC']]
      });

      // Calculate available time slots
      const availableSlots = [];
      
      for (const period of availability) {
        let currentTime = new Date(date);
        const [startHours, startMinutes] = period.startTime.split(':');
        currentTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
        
        const endTime = new Date(date);
        const [endHours, endMinutes] = period.endTime.split(':');
        endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

        while (currentTime < endTime) {
          const slotEnd = new Date(currentTime);
          slotEnd.setMinutes(slotEnd.getMinutes() + 30); // 30-minute slots

          const isBooked = bookedSchedules.some(schedule => 
            (currentTime >= new Date(schedule.startTime) && currentTime < new Date(schedule.endTime)) ||
            (slotEnd > new Date(schedule.startTime) && slotEnd <= new Date(schedule.endTime))
          );

          if (!isBooked) {
            availableSlots.push({
              start: new Date(currentTime),
              end: new Date(slotEnd)
            });
          }

          currentTime = slotEnd;
        }
      }

      return availableSlots;
    } catch (error) {
      logger.error('Error getting available times:', error);
      throw error;
    }
  }
}

module.exports = new ScheduleService();
