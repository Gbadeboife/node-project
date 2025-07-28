// Availability model defines the business hours for each day of the week
module.exports = (sequelize, DataTypes) => {
  const Availability = sequelize.define('Availability', {
    // Unique identifier for each availability record
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    // Day of the week (0-6 representing Sunday to Saturday)
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
        max: 6,
        notEmpty: true
      }
    },
    // Start time of availability for the day
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true,
        // Validate time format (HH:MM)
        is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
      }
    },
    // End time of availability for the day
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true,
        // Validate time format (HH:MM)
        is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        // Ensure end time is after start time
        isAfterStart(value) {
          if (value <= this.startTime) {
            throw new Error('End time must be after start time');
          }
        }
      }
    }
  }, {
    tableName: 'availabilities',
    timestamps: true
  });

  return Availability;
};
