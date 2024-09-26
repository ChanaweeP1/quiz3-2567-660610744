import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { Payload } from "@lib/DB";
import { Database } from "@lib/DB";

export const GET = async () => {
  const rawAuthHeader = headers().get("authorization");

  if (!rawAuthHeader || !rawAuthHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        ok: false,
        message: "Authorization header is required",
      },
      { status: 401 }
    );
  }

  const token = rawAuthHeader.split(" ")[1];

  const secret = process.env.JWT_SECRET || "This is my special secret";
  let roomId = null;

  let roomName = null;
  
  try {
    const payload = jwt.verify(token, secret);
    roomId = (<Payload>payload).roomId;

    roomName = (<Payload>payload).roomName;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  readDB();
  return NextResponse.json({
    ok: true,
    roomId,
    roomName,
  });
};


export const POST = async (request : NextRequest) => {
const payload = checkToken();
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  const { role, roomId , } = <Payload>payload;
  
  const body = await request.json();
  const { RoomName } = body;
  
  if( role == "ADMIN" || "SUPER_ADMIN"  ){
   
  readDB();
  const foundroom = (<Database>DB).Rooms.find((x) => x.roomName === RoomName);
  if(foundroom){
  return NextResponse.json(
     {
       ok: false,
       message: `Room ${"replace this with room name"} already exists`,
     },
     { status: 400 }
   );
  }

  //call writeDB after modifying Database
  writeDB();
  if(!foundroom){
   return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${"replace this with room name"} has been created`,
  });
}
}
};