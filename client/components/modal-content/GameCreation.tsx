"ise client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TimerIcon,
  LockIcon,
  GlobeIcon,
  ChatCircleIcon,
  CheckIcon,
  XIcon,
  PlayIcon,
  CircleIcon,
} from "@phosphor-icons/react";
import { useAppDispatch } from "@/redux/store";
import { setTrigger } from "@/redux/slices/triggers-slice";
import socket from "@/lib/socket";


interface GameSettings {
  timeSetting: number; // in milliseconds
  status: "private" | "public";
  disableComments: boolean;
  playAs: "X" | "O"
}

const GameCreation = (): React.ReactElement => {
  const dispatch = useAppDispatch();

  // Game settings
  const [settings, setSettings] = useState<GameSettings>({
    timeSetting: 30000, // Default 30 seconds
    status: "private",
    disableComments: false,
    playAs: "X"
  });

  // Time options
  const timeOptions = [
    { value: 30000, label: "Bullet", description: "30 seconds", icon: <TimerIcon weight="fill" className="h-5 w-5" /> },
    { value: 60000, label: "Blitz", description: "1 minute", icon: <TimerIcon weight="fill" className="h-5 w-5" /> },
    { value: 120000, label: "Rapid", description: "2 minutes", icon: <TimerIcon weight="fill" className="h-5 w-5" /> },
    { value: 180000, label: "Classical", description: "3 minutes", icon: <TimerIcon weight="fill" className="h-5 w-5" /> },
  ];


  // Function to create a game
  const handleCreateGame = () => {
    if (!socket.connected) {

      return;
    }
  };

  // Disables game creation modal
  const disableModal = () => dispatch(setTrigger({ key: "gameCreation", value: false }));
  return (
    <div className="space-y-6 p-2">
      {/* ===== Header ===== */}
      <header className="sm:text-center sm:block flex items-center justify-between">
        <div className="">
          <h2 className="text-xl font-bold">Create New Game</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Customize your Tic-Tac-Toe match
          </p>
        </div>

        {/* X/Cancel button */}
        <Button size="icon-lg" onClick={disableModal} variant="outline" className="sm:hidden">
          <XIcon />
        </Button>
      </header>

      {/* ===== Time Settings Cards ===== */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <TimerIcon className="h-4 w-4" />
          Time Control
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {timeOptions.map((option) => (
            <Card
              key={option.value}
              className={`p-4 cursor-pointer transition-all border ${settings.timeSetting === option.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
                }`}
              onClick={() => setSettings({ ...settings, timeSetting: option.value })}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-primary">{option.icon}</div>
                  <div>
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {option.description}
                    </div>
                  </div>
                </div>
                {settings.timeSetting === option.value && (<CheckIcon className="h-5 w-5 text-primary" weight="bold" />)}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ===== Seperator ===== */}
      <Separator />

      {/* ===== Game Settings ===== */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Game Settings</h3>

        {/* Visibility */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.status === "public" ? (
              <>
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <GlobeIcon className="h-5 w-5 text-blue-500" weight="fill" />
                </div>
                <div>
                  <div className="font-medium">Public Game</div>
                  <div className="text-xs text-muted-foreground">
                    First to join plays, anyone can spectate
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <LockIcon className="h-5 w-5 text-purple-500" weight="fill" />
                </div>
                <div>
                  <div className="font-medium">Private Game</div>
                  <div className="text-xs text-muted-foreground">
                    Invite-only, just you and 1 friend
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={settings.status === "public"}
              onCheckedChange={(checked) => setSettings({ ...settings, status: checked ? "public" : "private" })}
            />
          </div>
        </div>

        {/* Play As Preference */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${settings.playAs === "X" ? "bg-destructive/10" : "bg-blue-500/10"}`}>
              {settings.playAs === "X" ? (
                <XIcon className="h-5 w-5 text-red-500" weight="bold" />
              ) : (
                <CircleIcon className="h-5 w-5 text-blue-500" weight="bold" />
              )}
            </div>
            <div>
              <div className="font-medium">
                Play as {settings.playAs === "X" ? "X (First)" : "O (Second)"}
              </div>
              <div className="text-xs text-muted-foreground">
                {settings.playAs === "X"
                  ? "Make the first move"
                  : "Play as second player"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
            <Button
              variant={settings.playAs === "X" ? "default" : "ghost"}
              size="icon-lg"
              className={`h-8 px-3 ${settings.playAs === "X" ? "bg-red-500 hover:bg-red-600" : ""}`}
              onClick={() => setSettings({ ...settings, playAs: "X" })}
            >
              <XIcon className="h-4 w-4" weight="bold" />
            </Button>
            
            <Button
              variant={settings.playAs === "O" ? "default" : "ghost"}
              size="icon-lg"
              className={`h-8 px-3 ${settings.playAs === "O" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
              onClick={() => setSettings({ ...settings, playAs: "O" })}
            >
              <CircleIcon className="h-4 w-4" weight="bold" />
            </Button>
          </div>
        </div>
      </div>

      {/* ===== Seperator ===== */}
      <Separator />

      {/* ===== Chat Settings ===== */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Chat Settings</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${settings.disableComments ? "bg-red-500/10" : "bg-green-500/10"}`}>
              {settings.disableComments ? (
                <LockIcon className="h-5 w-5 text-red-500" weight="fill" />
              ) : (
                <ChatCircleIcon className="h-5 w-5 text-green-500" weight="fill" />
              )}
            </div>
            <div>
              <div className="font-medium">
                {settings.disableComments ? "Chat Disabled" : "Chat Enabled"}
              </div>
              <div className="text-xs text-muted-foreground">
                {settings.disableComments
                  ? "Players cannot communicate"
                  : "Players can chat during the game"}
              </div>
            </div>
          </div>

          <Switch
            checked={!settings.disableComments}
            onCheckedChange={(checked) => setSettings({ ...settings, disableComments: !checked })}
          />
        </div>
      </div>

      {/* ===== Seperator ===== */}
      <Separator />

      {/* ===== Summary ===== */}
      <Card className="p-4 bg-muted/30">
        <h3 className="text-sm font-semibold mb-3">Game Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time Control</span>
            <span className="font-medium">
              {timeOptions.find(t => t.value === settings.timeSetting)?.description}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Visibility</span>
            <Badge
              variant={settings.status === "public" ? "default" : "secondary"}
              className="gap-1"
            >
              {settings.status === "public" ? (
                <>
                  <GlobeIcon className="h-3 w-3" />
                  Public
                </>
              ) : (
                <>
                  <LockIcon className="h-3 w-3" />
                  Private
                </>
              )}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chat</span>
            <Badge
              variant={settings.disableComments ? "destructive" : "default"}
              className="gap-1"
            >
              {settings.disableComments ? (
                <>
                  <LockIcon className="h-3 w-3" />
                  Disabled
                </>
              ) : (
                <>
                  <ChatCircleIcon className="h-3 w-3" />
                  Enabled
                </>
              )}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={disableModal}
        >
          <XIcon className="h-4 w-4" />
          Cancel
        </Button>

        <Button
          onClick={handleCreateGame}
          className="flex-1 gap-2 bg-linear-to-r from-primary to-primary/70"
        >
          <PlayIcon className="h-4 w-4" />
          Create Game
        </Button>
      </div>
    </div>
  );
};

export default GameCreation;