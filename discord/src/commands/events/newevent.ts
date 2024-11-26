import {
  CommandInteraction,
  GuildScheduledEventEntityType,
  GuildScheduledEventManager,
  GuildScheduledEventPrivacyLevel,
  SlashCommandBuilder,
} from "discord.js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import { RedisClientType } from "redis";
import { notLoggedIn } from "../commonMessages.js";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

export default {
  data: new SlashCommandBuilder()
    .setName("newevent")
    .setDescription("Creates a new event on Pyramids and Discord.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the event")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("The description of the event")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("location")
        .setDescription("The location of the event")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("start_time")
        .setDescription("The start time of the event")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("end_time")
        .setDescription("The end time of the event")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("image")
        .setDescription("The image of the event")
        .setRequired(false)
    ),

  async execute(interaction: CommandInteraction, redisClient: RedisClientType) {
    await interaction.reply("🤔  Creating new event...");

    const name = interaction.options.get("name", true);
    const description = interaction.options.get("description", true);
    const location = interaction.options.get("location", true);
    const startTime_string = interaction.options.get("start_time", true);
    const endTime_string = interaction.options.get("end_time", true);
    const image = interaction.options.get("image") ?? null;

    const startTime = dayjs(startTime_string.value as string, [
      "DD/MM/YYYY HH:mm",
      "D/M/YYYY HH:mm",
      "D/M/YY HH:mm",
    ]);
    const endTime = dayjs(endTime_string.value as string, [
      "DD/MM/YYYY HH:mm",
      "D/M/YYYY HH:mm",
      "D/M/YY HH:mm",
    ]);

    if (!startTime.isValid() || !endTime.isValid()) {
      await interaction.followUp({
        content:
          "⚠️  Invalid date format. Please use: DD/MM/YYYY HH:mm, D/M/YYYY HH:mm, or D/M/YY HH:mm.",
        ephemeral: true,
      });
      return;
    }

    if (!startTime.isBefore(endTime)) {
      await interaction.followUp({
        content: "⚠️  Start time must precede the end time.",
        ephemeral: true,
      });
      return;
    }

    if (startTime.isSameOrBefore(dayjs())) {
      await interaction.followUp({
        content: "⚠️  Start time must be in the future.",
        ephemeral: true,
      });
      return;
    }

    // check if logged in
    const user = await redisClient.get(`discord_${interaction.user.id}`);

    if (!user) {
      await interaction.followUp(notLoggedIn);
      return;
    }

    const manager = interaction.guild
      ?.scheduledEvents as GuildScheduledEventManager;
    const event = await manager.create({
      name: name.value as string,
      channel: interaction.channelId,
      entityMetadata: {
        location: location.value as string,
      },
      scheduledStartTime: startTime.toDate(),
      scheduledEndTime: endTime.toDate(),
      privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
      entityType: GuildScheduledEventEntityType.External,
      description: description.value as string,
      image: image ? (image.value as string) : null,
    });
    // TODO: update link below
    interaction.editReply(
      `✅  **Created event '${event.name}'**.\n🔗  Pyramids link: TODO`
    );
  },
};
