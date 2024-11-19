import {
  CommandInteraction,
  GuildScheduledEventEntityType,
  GuildScheduledEventManager,
  GuildScheduledEventPrivacyLevel,
  SlashCommandBuilder,
} from "discord.js";
import { RedisClientType } from "redis";
import { notLoggedIn } from "../commonMessages.js";

export default {
  data: new SlashCommandBuilder()
    .setName("me")
    .setDescription(
      "Get some basic user info associated with your Pyramids account."
    ),

  async execute(interaction: CommandInteraction, redisClient: RedisClientType) {
    const user = await redisClient.get(`discord_${interaction.user.id}`);

    if (!user) {
      await interaction.reply(notLoggedIn);
    } else {
      await interaction.reply({
        content: `You are logged in as **${user}**.`,
        ephemeral: true,
      });
    }
  },
};
