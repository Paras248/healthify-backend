const changeLetterCase = (name) => {
    const namedArray = name.split(" ");
    for (let i = 0; i < namedArray.length; i++) {
        const changedCaseName =
            namedArray[i].charAt(0).toUpperCase() + namedArray[i].slice(1);
        namedArray[i] = changedCaseName;
    }
    name = namedArray.join(" ");
    return name;
};

module.exports = changeLetterCase;
