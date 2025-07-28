// Booking Model - Represents a user's booking of a schedule slot
module.exports = (sequelize, DataTypes) => {
  // Define the Booking model with the following fields:
  // - id: Unique identifier (auto-incrementing integer)
  // - scheduleId: Reference to the schedule being booked
  // - fullName: Name of the person booking
  // - email: Contact email
  // - company: Company name
  // - phone: Contact phone number
  // - notes: Optional additional notes
  // - status: Booking status (pending/confirmed/cancelled)
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    scheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'schedules',
        key: 'id'
      }
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    notes: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'pending'
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
    tableName: 'bookings',
    timestamps: true
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.Schedule, {
      foreignKey: 'scheduleId',
      as: 'schedule'
    });
  };

  return Booking;
};
