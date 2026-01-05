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
import { setBooleanTrigger } from "@/redux/slices/triggers-slice";
import { GameSettings } from "@/redux/apis/game-api";
import { Spinner } from "../ui/spinner";
import useCreateGame from "@/hooks/useCreateGame";
import { callToast } from "@/providers/SonnerProvider";

interface GameCreationProps {
  updateMode?: boolean;
  previousGameSettings?: GameSettings;
}

const GameCreation = (props: GameCreationProps): React.ReactElement => {
  const dispatch = useAppDispatch();

  // Game settings
  const [settings, setSettings] = useState<GameSettings>({
    time_setting_ms: (props.updateMode && props.previousGameSettings) ? props.previousGameSettings.time_setting_ms : 30000,
    visibility: (props.updateMode && props.previousGameSettings) ? props.previousGameSettings.visibility : "private",
    disabled_comments: (props.updateMode && props.previousGameSettings) ? props.previousGameSettings.disabled_comments : true,
    play_as_preference: (props.updateMode && props.previousGameSettings) ? props.previousGameSettings.play_as_preference : "X",
  });

  // Time options
  const timeOptions = [
    { value: 30000, label: "Bullet", description: "30 seconds", icon: <TimerIcon weight="fill" className="h-5 w-5" /> },
    { value: 60000, label: "Blitz", description: "1 minute", icon: <TimerIcon weight="fill" className="h-5 w-5" /> },
    { value: 120000, label: "Rapid", description: "2 minutes", icon: <TimerIcon weight="fill" className="h-5 w-5" /> },
    { value: 180000, label: "Classical", description: "3 minutes", icon: <TimerIcon weight="fill" className="h-5 w-5" /> },
  ];


  // Game creation
  const { extra, isLoading: isCreatingGame, executeService } = useCreateGame(settings, setSettings);
  const gameCreationValidationErrors = extra?.validationErrors || [];

  // Update game

  // Disables game creation modal
  const disableModal = () => dispatch(setBooleanTrigger({ key: "gameCreation", value: false }));

  // Executes if creating a game
  const onCreateGame = async () => {
    try {
      await executeService(settings);
    } catch (err) {
      console.error(`===== Game creation error =====\n${err}`);
      callToast("error", "An unexpected error occured while trying to create your game, please try again shortly");
    }
  }

  // Executes if editing a game
  const onUpdateGame = async () => {
    try {

    } catch (err) {

    }
  };
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

      {/* ===== Validation errors ===== */}
      {gameCreationValidationErrors.length > 0 && (
        <div className="overflow-hidden my-4">
          <div className="flex flex-col bg-destructive/10 border border-destructive h-40 overflow-y-auto p-2 gap-2 element-scrollable-hidden-scrollbar">
            <p className="text-xs text-destructive border-b border-destructive pb-1.5">Validation errors</p>
            <div className="flex flex-col gap-2 text-destructive px-4">
              {gameCreationValidationErrors.map((error, i) => {
                return (
                  <li key={i}>{error.field} - {error.message}</li>
                )
              })}
            </div>
          </div>
        </div>
      )}

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
              className={`p-4 cursor-pointer transition-all border ${settings.time_setting_ms === option.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30"
                }`}
              onClick={() => setSettings({ ...settings, time_setting_ms: option.value })}
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
                {settings.time_setting_ms === option.value && (<CheckIcon className="h-5 w-5 text-primary" weight="bold" />)}
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
            {settings.visibility === "public" ? (
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
              checked={settings.visibility === "public"}
              onCheckedChange={(checked) => setSettings({ ...settings, visibility: checked ? "public" : "private" })}
            />
          </div>
        </div>

        {/* Play As Preference */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${settings.play_as_preference === "X" ? "bg-destructive/10" : "bg-blue-500/10"}`}>
              {settings.play_as_preference === "X" ? (
                <XIcon className="h-5 w-5 text-red-500" weight="bold" />
              ) : (
                <CircleIcon className="h-5 w-5 text-blue-500" weight="bold" />
              )}
            </div>
            <div>
              <div className="font-medium">
                Play as {settings.play_as_preference === "X" ? "X (First)" : "O (Second)"}
              </div>
              <div className="text-xs text-muted-foreground">
                {settings.play_as_preference === "X"
                  ? "Make the first move"
                  : "Play as second player"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
            <Button
              variant={settings.play_as_preference === "X" ? "default" : "ghost"}
              size="icon-lg"
              className={`h-8 px-3 ${settings.play_as_preference === "X" ? "bg-red-500 hover:bg-red-600" : ""}`}
              onClick={() => setSettings({ ...settings, play_as_preference: "X" })}
            >
              <XIcon className="h-4 w-4" weight="bold" />
            </Button>

            <Button
              variant={settings.play_as_preference === "O" ? "default" : "ghost"}
              size="icon-lg"
              className={`h-8 px-3 ${settings.play_as_preference === "O" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
              onClick={() => setSettings({ ...settings, play_as_preference: "O" })}
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
            <div className={`p-2 rounded-lg ${settings.disabled_comments ? "bg-red-500/10" : "bg-green-500/10"}`}>
              {settings.disabled_comments ? (
                <LockIcon className="h-5 w-5 text-red-500" weight="fill" />
              ) : (
                <ChatCircleIcon className="h-5 w-5 text-green-500" weight="fill" />
              )}
            </div>
            <div>
              <div className="font-medium">
                {settings.disabled_comments ? "Chat Disabled" : "Chat Enabled"}
              </div>
              <div className="text-xs text-muted-foreground">
                {settings.disabled_comments
                  ? "Players cannot communicate"
                  : "Players can chat during the game"}
              </div>
            </div>
          </div>

          <Switch
            checked={!settings.disabled_comments}
            onCheckedChange={(checked) => setSettings({ ...settings, disabled_comments: !checked })}
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
              {timeOptions.find(t => t.value === settings.time_setting_ms)?.description}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Visibility</span>
            <Badge
              variant={settings.visibility === "public" ? "default" : "secondary"}
              className="gap-1"
            >
              {settings.visibility === "public" ? (
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
              variant={settings.disabled_comments ? "destructive" : "default"}
              className="gap-1"
            >
              {settings.disabled_comments ? (
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
          disabled={isCreatingGame}
          variant="outline"
          className="flex-1 gap-2"
          onClick={disableModal}
        >
          <XIcon className="h-4 w-4" />
          Cancel
        </Button>

        <Button
          disabled={isCreatingGame}
          onClick={onCreateGame}
          className="flex-1 gap-2 bg-linear-to-r from-primary to-primary/70"
        >
          {props.updateMode ? (
            <>
              {isCreatingGame ? (<Spinner />) : (<PlayIcon className="h-4 w-4" />)}
              {isCreatingGame ? "Creating..." : "Create Game"}
            </>
          ) : (
            <>
              {isCreatingGame ? (<Spinner />) : (<PlayIcon className="h-4 w-4" />)}
              {isCreatingGame ? "Creating..." : "Create Game"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default GameCreation;