import { SlashCommandBuilder, Routes } from "discord.js";
import { REST } from "@discordjs/rest";
import { Client, GatewayIntentBits } from "discord.js";
import { GetToken, GetAppId, GetGuildId } from "botway.js";

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  new SlashCommandBuilder()
    .setName("server")
    .setDescription("Replies with server info!"),
  new SlashCommandBuilder()
    .setName("user")
    .setDescription("Replies with user info!"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(GetToken());

// how I can get the id of my server? the answer in this github discussion https://github.com/abdfnx/botway/discussions/4#discussioncomment-2653737
rest
  .put(
    Routes.applicationGuildCommands(GetAppId(), GetGuildId("YOUR_SERVER_NAME")),
    { body: commands }
  )
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction: any) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "server") {
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
  } else if (commandName === "user") {
    await interaction.reply(
      `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`
    );
  }
});

client.login(GetToken());
