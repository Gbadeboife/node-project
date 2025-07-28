// Schedule Model - Represents available time slots for bookings
module.exports = (sequelize, DataTypes) => {
  // Define the Schedule model with the following fields:
  // - id: Unique identifier (auto-incrementing integer)
  // - date: Date of the schedule (YYYY-MM-DD)
  // - startTime: Start time of the slot (HH:mm:ss)
  // - endTime: End time of the slot (HH:mm:ss)
  // - timezone: Timezone of the schedule (string)
  // - isAvailable: Whether the slot is available (boolean)
  const Schedule = sequelize.define('Schedule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterToday(value) {
          if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
            throw new Error('Date must be today or in the future');
          }
        }
      }
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'schedules',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['date', 'startTime', 'timezone']
      }
    ]
  });

  Schedule.associate = (models) => {
    Schedule.hasMany(models.Booking, {
      foreignKey: 'scheduleId',
      as: 'bookings'
    });
  };

  return Schedule;
};
