const getDate = () => {
    let d = new Date();
    let hour = d.getHours();
    let date = d.getDate();
    let month = d.getMonth();
    let year = d.getFullYear();
    return fullDate = `${hour}${date}${month}${year}`;
}

module.exports = getDate;