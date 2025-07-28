// Schedule model defines the structure for appointments in the system
module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    // Unique identifier for each schedule
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    // Client's full name
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100],
        notEmpty: true
      }
    },
    // Client's email address
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    // Client's phone number
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        // Validate phone number format
        is: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
      }
    },
    // Start time of the appointment
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: true,
        // Ensure start time is not in the past
        isNotPast(value) {
          if (value < new Date()) {
            throw new Error('Start time cannot be in the past');
          }
        }
      }
    },
    // End time of the appointment
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: true,
        // Ensure end time is after start time
        isAfterStart(value) {
          if (value <= this.startTime) {
            throw new Error('End time must be after start time');
          }
        }
      }
    },
    // Optional notes for the appointment
    notes: {
      type: DataTypes.TEXT
    },
    // Client's timezone
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        // Validate timezone format
        isValidTimezone(value) {
          try {
            Intl.DateTimeFormat(undefined, { timeZone: value });
          } catch (e) {
            throw new Error('Invalid timezone');
          }
        }
      }
    },
    // Status of the appointment
    status: {
      type: DataTypes.ENUM('booked', 'cancelled'),
      defaultValue: 'booked',
      validate: {
        isIn: [['booked', 'cancelled']]
      }
    }
  }, {
    tableName: 'schedules',
    timestamps: true
  });

  return Schedule;
};
