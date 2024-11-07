import {
  CommandInteraction,
  GuildScheduledEventEntityType,
  GuildScheduledEventManager,
  GuildScheduledEventPrivacyLevel,
  SlashCommandBuilder,
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('newevent')
    .setDescription('Creates a new event on Pyramids and Discord.'),
  async execute(interaction: CommandInteraction) {
    await interaction.reply('Creating new event...');

    const manager = interaction.guild
      ?.scheduledEvents as GuildScheduledEventManager;
    const event = await manager.create({
      name: 'My Event',
      channel: interaction.channelId,
      entityMetadata: {
        location: 'Somewhere in the world',
      },
      scheduledStartTime: new Date(2025, 10, 3),
      scheduledEndTime: new Date(2025, 10, 6),
      privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
      entityType: GuildScheduledEventEntityType.External,
      description: 'My description',
    });
    interaction.editReply(`Created event ${event.id}`);
  },
};
