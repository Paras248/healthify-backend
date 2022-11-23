const changeLetterCase = (firstName, middleName, lastName) => {
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    middleName = middleName.charAt(0).toUpperCase() + middleName.slice(1);
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    return { firstName, middleName, lastName };
};

module.exports = changeLetterCase;
