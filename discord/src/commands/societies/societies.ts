import {
  CommandInteraction,
  GuildScheduledEventEntityType,
  GuildScheduledEventManager,
  GuildScheduledEventPrivacyLevel,
  SlashCommandBuilder,
} from "discord.js";
import dayjs from "dayjs";
import { RedisClientType } from "redis";
import { notLoggedIn } from "../commonMessages.js";

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

    // fetch societies
    interaction.editReply(`✅  **Fetched societies!`);
  },
};
