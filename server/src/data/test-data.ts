const jamalsId = "69657691fdb917e5c05d92c3";
const otherAccsId = "6967a9eb21e3e296b7166539";

export const testData = [
    {
        result: "decisive",
        winner: jamalsId,
        gameSettings: { status: "finished", visibility: "public" },
        durationMs: 45001, // Unique duration
        finishedAt: new Date("2026-01-20T10:00:00Z"),
        players: [{ userId: jamalsId, preference: "X" }, { userId: otherAccsId, preference: "O" }],
        moves: [{ playedAt: new Date("2026-01-20T09:59:00Z"), playedBy: jamalsId, value: "X", boardLocation: 0 }]
    },
    {
        result: "draw",
        winner: null,
        gameSettings: { status: "finished", visibility: "public" },
        durationMs: 120002,
        finishedAt: new Date("2026-01-20T11:30:00Z"),
        players: [{ userId: jamalsId, preference: "O" }, { userId: otherAccsId, preference: "X" }],
        moves: [{ playedAt: new Date("2026-01-20T11:28:00Z"), playedBy: otherAccsId, value: "X", boardLocation: 1 }]
    },
    {
        result: "decisive",
        winner: otherAccsId,
        gameSettings: { status: "finished", visibility: "public" },
        durationMs: 30003,
        finishedAt: new Date("2026-01-19T09:15:00Z"),
        players: [{ userId: jamalsId, preference: "X" }, { userId: otherAccsId, preference: "O" }],
        moves: [{ playedAt: new Date("2026-01-19T09:14:00Z"), playedBy: jamalsId, value: "X", boardLocation: 2 }]
    },
    {
        result: "decisive",
        winner: jamalsId,
        gameSettings: { status: "finished", visibility: "public" },
        durationMs: 85004,
        finishedAt: new Date("2026-01-18T22:10:00Z"),
        players: [{ userId: jamalsId, preference: "X" }, { userId: otherAccsId, preference: "O" }],
        moves: [{ playedAt: new Date("2026-01-18T22:08:00Z"), playedBy: jamalsId, value: "X", boardLocation: 3 }]
    },
    {
        result: "decisive",
        winner: jamalsId,
        gameSettings: { status: "finished", visibility: "public" },
        durationMs: 15005,
        finishedAt: new Date("2026-01-18T14:00:00Z"),
        players: [{ userId: jamalsId, preference: "O" }, { userId: otherAccsId, preference: "X" }],
        moves: [{ playedAt: new Date("2026-01-18T13:59:00Z"), playedBy: jamalsId, value: "O", boardLocation: 4 }]
    },
    {
        result: "draw",
        winner: null,
        gameSettings: { status: "finished", visibility: "public" },
        durationMs: 200006,
        finishedAt: new Date("2026-01-17T12:00:00Z"),
        players: [{ userId: jamalsId, preference: "X" }, { userId: otherAccsId, preference: "O" }],
        moves: [{ playedAt: new Date("2026-01-17T11:55:00Z"), playedBy: otherAccsId, value: "O", boardLocation: 5 }]
    },
    {
        result: "decisive",
        winner: otherAccsId,
        gameSettings: { status: "finished", visibility: "public" },
        durationMs: 55007,
        finishedAt: new Date("2026-01-16T19:45:00Z"),
        players: [{ userId: jamalsId, preference: "X" }, { userId: otherAccsId, preference: "O" }],
        moves: [{ playedAt: new Date("2026-01-16T19:44:00Z"), playedBy: otherAccsId, value: "O", boardLocation: 6 }]
    },
    {
        result: "decisive",
        winner: jamalsId,
        gameSettings: { status: "finished", visibility: "public" },
        durationMs: 42008,
        finishedAt: new Date("2026-01-15T08:30:00Z"),
        players: [{ userId: jamalsId, preference: "X" }, { userId: otherAccsId, preference: "O" }],
        moves: [{ playedAt: new Date("2026-01-15T08:29:00Z"), playedBy: jamalsId, value: "X", boardLocation: 7 }]
    },
    {
        result: "decisive",
        winner: otherAccsId,
        gameSettings: { status: "finished", visibility: "public" },
        durationMs: 95009,
        finishedAt: new Date("2026-01-14T21:00:00Z"),
        players: [{ userId: jamalsId, preference: "O" }, { userId: otherAccsId, preference: "X" }],
        moves: [{ playedAt: new Date("2026-01-14T20:58:00Z"), playedBy: otherAccsId, value: "X", boardLocation: 8 }]
    },
    {
        result: "decisive",
        winner: jamalsId,
        gameSettings: { status: "finished", visibility: "public" },
        durationMs: 62010,
        finishedAt: new Date("2026-01-13T15:20:00Z"),
        players: [{ userId: jamalsId, preference: "X" }, { userId: otherAccsId, preference: "O" }],
        moves: [{ playedAt: new Date("2026-01-13T15:19:00Z"), playedBy: jamalsId, value: "X", boardLocation: 0 }]
    },
    {
        result: "draw",
        winner: null,
        gameSettings: { status: "finished", visibility: "public" },
        durationMs: 150011,
        finishedAt: new Date("2026-01-12T11:10:00Z"),
        players: [{ userId: jamalsId, preference: "X" }, { userId: otherAccsId, preference: "O" }],
        moves: [{ playedAt: new Date("2026-01-12T11:05:00Z"), playedBy: otherAccsId, value: "O", boardLocation: 1 }]
    },
    {
        result: "decisive",
        winner: jamalsId,
        gameSettings: { status: "finished", visibility: "public" },
        durationMs: 28012,
        finishedAt: new Date("2026-01-11T17:55:00Z"),
        players: [{ userId: jamalsId, preference: "O" }, { userId: otherAccsId, preference: "X" }],
        moves: [{ playedAt: new Date("2026-01-11T17:54:00Z"), playedBy: jamalsId, value: "O", boardLocation: 2 }]
    },
    {
        result: "decisive",
        winner: otherAccsId,
        gameSettings: { status: "finished", visibility: "public" },
        durationMs: 38013,
        finishedAt: new Date("2026-01-10T13:40:00Z"),
        players: [{ userId: jamalsId, preference: "X" }, { userId: otherAccsId, preference: "O" }],
        moves: [{ playedAt: new Date("2026-01-10T13:39:00Z"), playedBy: otherAccsId, value: "O", boardLocation: 3 }]
    },
    {
        result: "decisive",
        winner: jamalsId,
        gameSettings: { status: "finished", visibility: "public" },
        durationMs: 48014,
        finishedAt: new Date("2026-01-09T10:05:00Z"),
        players: [{ userId: jamalsId, preference: "X" }, { userId: otherAccsId, preference: "O" }],
        moves: [{ playedAt: new Date("2026-01-09T10:04:00Z"), playedBy: jamalsId, value: "X", boardLocation: 4 }]
    },
    // {
    //     result: "decisive",
    //     winner: otherAccsId,
    //     gameSettings: { status: "finished", visibility: "public" },
    //     durationMs: 72015,
    //     finishedAt: new Date("2026-01-08T16:20:00Z"),
    //     players: [{ userId: jamalsId, preference: "O" }, { userId: otherAccsId, preference: "X" }],
    //     moves: [{ playedAt: new Date("2026-01-08T16:19:00Z"), playedBy: otherAccsId, value: "X", boardLocation: 5 }]
    // }
];