module.exports = (sequelize, DataTypes)=>{
    const attendance = sequelize.define("attendance",{
        attendance_id:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    })
    return attendance
}