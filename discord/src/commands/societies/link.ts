import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { RedisClientType } from "redis";
import { notLoggedIn } from "../commonMessages.js";

export default {
  data: new SlashCommandBuilder()
    .setName("link")
    .setDescription("Connect a Pyramids society to this Discord server."),

  async execute(interaction: CommandInteraction, redisClient: RedisClientType) {
    await interaction.reply("🤔  Working on it...");

    // check if logged in
    const user = await redisClient.get(`discord_${interaction.user.id}`);

    if (!user) {
      await interaction.followUp(notLoggedIn);
      return;
    }

    // fetch societies
    interaction.editReply(`✅  **Fetched societies!`);
  },
};
