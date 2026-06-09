import { Client } from "discord-rpc";

import { t } from "../../strings";

import { config } from "./config";

// internal state
let rpc: Client;

export async function initDiscordRpc() {
  if (!config.discordRpc) return;

  // clean up existing client if one exists
  rpc?.removeAllListeners();

  try {
    rpc = new Client({ transport: "ipc" });

    rpc.on("ready", () =>
      rpc.setActivity({
        state: "stoat.chat",
        details: t("discord.details"),
        largeImageKey: "qr",
        largeImageText: t("discord.join"),
        buttons: [
          {
            label: t("discord.join_button"),
            url: "https://stoat.chat/",
          },
        ],
      }),
    );

    rpc.on("disconnected", reconnect);

    rpc.login({ clientId: "872068124005007420" });
  } catch (err) {
    reconnect();
  }
}

const reconnect = () => setTimeout(() => initDiscordRpc(), 1e4);

export async function destroyDiscordRpc() {
  rpc?.destroy();
}
