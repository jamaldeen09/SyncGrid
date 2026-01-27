import { Socket } from "socket.io";
import { SessionData } from "@shared/index";

export type ConfiguredSocket = Socket & ({ user: SessionData });