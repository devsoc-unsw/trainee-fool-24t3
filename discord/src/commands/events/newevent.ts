import {
  CommandInteraction,
  GuildScheduledEventEntityType,
  GuildScheduledEventManager,
  GuildScheduledEventPrivacyLevel,
  SlashCommandBuilder,
} from 'discord.js';
import dayjs from 'dayjs';

export default {
  data: new SlashCommandBuilder()
    .setName('newevent')
    .setDescription('Creates a new event on Pyramids and Discord.')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('The name of the event')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('The description of the event')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('location')
        .setDescription('The location of the event')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('start_time')
        .setDescription('The start time of the event')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('end_time')
        .setDescription('The end time of the event')
        .setRequired(true)
    ),

  async execute(interaction: CommandInteraction) {
    await interaction.reply('Creating new event...');

    const name = interaction.options.get('name', true);
    const description = interaction.options.get('description', true);
    const location = interaction.options.get('location', true);
    const startTime_string = interaction.options.get('start_time', true);
    const endTime_string = interaction.options.get('end_time', true);

    // TODO: improve date parsing
    const startTime = dayjs(startTime_string.value as string).toDate();
    const endTime = dayjs(endTime_string.value as string).toDate();

    const manager = interaction.guild
      ?.scheduledEvents as GuildScheduledEventManager;
    const event = await manager.create({
      name: name.value as string,
      channel: interaction.channelId,
      entityMetadata: {
        location: location.value as string,
      },
      scheduledStartTime: startTime,
      scheduledEndTime: endTime,
      privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
      entityType: GuildScheduledEventEntityType.External,
      description: description.value as string,
    });
    interaction.editReply(`Created event ${event.id}`);
  },
};
