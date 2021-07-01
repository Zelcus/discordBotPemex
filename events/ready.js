module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        client.user.setActivity("P E M E X", { type: "LISTENING" });
    },
};
