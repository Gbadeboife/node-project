module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT
    },
    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Appointment;
};
