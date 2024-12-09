import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { RedisClientType } from "redis";
import { notLoggedIn } from "../commonMessages.js";
import { BACKEND_URL } from "../../bot.js";

export default {
  data: new SlashCommandBuilder()
    .setName("societies")
    .setDescription("See what societies you're involved with."),

  async execute(interaction: CommandInteraction, redisClient: RedisClientType) {
    await interaction.reply("🤔  Fetching societies...");

    // check if logged in
    const user = await redisClient.get(`discord_${interaction.user.id}`);

    if (!user) {
      await interaction.followUp(notLoggedIn);
      return;
    }

    console.log(user);

    // get a user's societies
    const societies = fetch(BACKEND_URL + "/user/societies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // fetch societies
    interaction.editReply(`✅  **Fetched societies!`);
  },
};
