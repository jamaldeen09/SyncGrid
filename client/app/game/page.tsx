"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  UsersIcon,
  EyeIcon,
  TrophyIcon,
  FireIcon,
  ClockIcon,
  ChatCircleIcon,
  XIcon,
  CircleIcon,
  ShareNetworkIcon,
  UserCircleIcon,
  PaperPlaneIcon,
  GearIcon,
} from "@phosphor-icons/react";

const Game = (): React.ReactElement => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [currentPlayer] = useState("You");
  const [opponent] = useState("Alex Chen");
  const [spectators, setSpectators] = useState(24);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Spectator1", message: "Great move!", time: "2m ago" },
    { id: 2, user: "PlayerX", message: "GG!", time: "1m ago" },
    { id: 3, user: "TicTacFan", message: "This is intense!", time: "30s ago" },
    { id: 4, user: "GameWatcher", message: "What a strategy!", time: "10s ago" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [moves] = useState(4);

  const handleClick = (index: number) => {
    if (board[index] || calculateWinner(board)) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6], // diagonals
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : board.every(square => square)
      ? "Draw!"
      : `Next player: ${isXNext ? "X" : "O"}`;

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: chatMessages.length + 1,
        user: "You",
        message: newMessage,
        time: "just now"
      };
      setChatMessages([...chatMessages, newMsg]);
      setNewMessage("");
    }
  };

  const renderSquare = (index: number) => {
    const isWinningSquare = winner && (
      (index === 0 || index === 3 || index === 6) && board[0] === board[3] && board[3] === board[6] ||
      (index === 1 || index === 4 || index === 7) && board[1] === board[4] && board[4] === board[7] ||
      (index === 2 || index === 5 || index === 8) && board[2] === board[5] && board[5] === board[8] ||
      (index === 0 || index === 1 || index === 2) && board[0] === board[1] && board[1] === board[2] ||
      (index === 3 || index === 4 || index === 5) && board[3] === board[4] && board[4] === board[5] ||
      (index === 6 || index === 7 || index === 8) && board[6] === board[7] && board[7] === board[8] ||
      (index === 0 || index === 4 || index === 8) && board[0] === board[4] && board[4] === board[8] ||
      (index === 2 || index === 4 || index === 6) && board[2] === board[4] && board[4] === board[6]
    );

    return (
      <button
        className="aspect-square w-full rounded-xl bg-linear-to-br from-card to-card/80 border-2 border-border/50 hover:border-primary/30 transition-all duration-200 flex items-center justify-center text-6xl font-bold relative overflow-hidden group"
        onClick={() => handleClick(index)}
        disabled={!!winner || !!board[index]}
      >
        {/* Hover effect */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-200" />

        {/* Winning line highlight */}
        {isWinningSquare && (
          <div className="absolute inset-0 bg-green-500/10 animate-pulse" />
        )}

        {/* Content */}
        {board[index] === "X" ? (
          <div className="text-red-500">
            <XIcon weight="bold" className="h-16 w-16" />
          </div>
        ) : board[index] === "O" ? (
          <div className="text-blue-500">
            <CircleIcon weight="bold" className="h-16 w-16" />
          </div>
        ) : (
          <span className="text-muted-foreground/30 h-16 w-16">
            {index + 1}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Game Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tic-Tac-Toe Live Match</h1>
            <p className="text-muted-foreground">Public Game • Match ID: #TTT-{Math.floor(Math.random() * 10000)}</p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <ShareNetworkIcon className="h-4 w-4" />
              Share
            </Button>

            {/* ===== Feature for v2 ===== */}
            {/* <Button variant="outline" size="sm" className="gap-2">
              <Flag className="h-4 w-4" />
              Report
            </Button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Player Info & Stats */}
          <div className="space-y-6">
            {/* Current Player Card */}
            <Card className="p-6 border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarFallback className="bg-linear-to-br from-primary to-primary/70 text-primary-foreground">
                      Y
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{currentPlayer}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="gap-1">
                        <XIcon className="h-3 w-3 text-red-500" />
                        <span>Playing as X</span>
                      </Badge>

                      {/* ===== Feature for v2 ===== */}
                      {/* <Badge variant="outline" className="gap-1">
                        <CrownIcon className="h-3 w-3" />
                        <span>Rank 24</span>
                      </Badge> */}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-500">83%</div>
                  <div className="text-xs text-muted-foreground">Win Rate</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Games Won</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Streak</span>
                  <span className="font-semibold flex items-center gap-1">
                    <FireIcon className="h-3 w-3 text-orange-500" />
                    8 wins
                  </span>
                </div>
              </div>
            </Card>

            {/* Opponent Card */}
            <Card className="p-6 border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-blue-500/20">
                    <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white">
                      A
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{opponent}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="gap-1">
                        <CircleIcon className="h-3 w-3 text-blue-500" />
                        <span>Playing as O</span>
                      </Badge>

                      {/* ===== Feature for v2 ===== */}
                      {/* <Badge variant="outline" className="gap-1">
                        <TrophyIcon className="h-3 w-3" />
                        <span>Rank 12</span>
                      </Badge> */}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-500">76%</div>
                  <div className="text-xs text-muted-foreground">Win Rate</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Games Won</span>
                  <span className="font-semibold">128</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-semibold flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    3.2s avg
                  </span>
                </div>
              </div>
            </Card>

            {/* Live Stats */}
            <Card className="p-6 border-border/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                {/* <TrendingUp className="h-4 w-4" /> */}

                Live Match Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Move {moves}/9</span>
                    <span className="font-medium">{Math.round((moves / 9) * 100)}%</span>
                  </div>
                  {/* <Progress value={(moves / 9) * 100} className="h-2" /> */}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold">2:34</div>
                    <div className="text-xs text-muted-foreground">Time Elapsed</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold flex items-center justify-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      {spectators}
                    </div>
                    <div className="text-xs text-muted-foreground">Spectators</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Center Column - Game Board */}
          <div className="space-y-6">
            {/* Game Status */}
            <Card className="p-6 border-border/50">
              <div className="text-center">
                <div className="text-xl font-semibold mb-2">{status}</div>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-muted-foreground">Live</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    <span className="text-sm">Move timer: 15s</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Game Board */}
            <Card className="p-6 border-border/50">
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                  <div key={index} className="aspect-square">
                    {renderSquare(index)}
                  </div>
                ))}
              </div>
            </Card>

            {/* Game Controls */}
            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-2">
                <GearIcon />
                Update game settings
              </Button>

              <Button className="gap-2 bg-linear-to-r from-primary to-primary/70">
                <TrophyIcon className="h-4 w-4" />
                Surrender
              </Button>
            </div>

            {/* Move History */}
            <Card className="p-6 border-border/50">
              <h3 className="font-semibold mb-4">Move History</h3>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((move) => (
                  <div
                    key={move}
                    className={`p-3 rounded-lg text-center ${move <= moves ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'}`}
                  >
                    <div className="text-sm font-medium">Move {move}</div>
                    <div className="text-xs text-muted-foreground">
                      {move <= moves ? (move % 2 === 1 ? 'X' : 'O') : '-'}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Live Chat & Spectators */}
          <div className="space-y-6">
            {/* Spectators */}
            <Card className="p-6 border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <UsersIcon className="h-4 w-4" />
                  Live Spectators
                </h3>
                <Badge variant="outline" className="gap-1">
                  <EyeIcon className="h-3 w-3" />
                  {spectators}
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="h-4 w-4 text-muted-foreground" />
                    <span>Spectator1</span>
                  </div>
                  <span className="text-muted-foreground">Watching</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="h-4 w-4 text-muted-foreground" />
                    <span>GameWatcher</span>
                  </div>
                  <span className="text-muted-foreground">Watching</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="h-4 w-4 text-muted-foreground" />
                    <span>TicTacFan</span>
                  </div>
                  <span className="text-muted-foreground">Watching</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setSpectators(prev => prev + 1)}
                >
                  + Show {spectators - 3} more spectators
                </Button>
              </div>
            </Card>

            {/* Live Chat */}
            <Card className="flex flex-col border-border/50 h-125">
              <div className="p-4 border-b border-border/50">
                <h3 className="font-semibold flex items-center gap-2">
                  <ChatCircleIcon className="h-4 w-4" />
                  Live Chat
                </h3>
                <p className="text-xs text-muted-foreground">
                  Spectators chatting about this match
                </p>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${msg.user === "You" ? "text-primary" : ""}`}>
                        {msg.user}
                      </span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="bg-linear-to-r from-primary to-primary/70"
                  >
                    <PaperPlaneIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;