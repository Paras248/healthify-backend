const generateUniqueId = require("generate-unique-id");

const checkAndGenerateId = async (prisma) => {
    while (true) {
        const generatedId = generateUniqueId({
            length: 12,
            useLetters: false,
        });
        const patient = await prisma.patient.findUnique({
            where: {
                id: generatedId,
            },
        });
        if (!patient) {
            uniqueId = generatedId;
            return uniqueId;
        }
    }
};

module.exports = checkAndGenerateId;
