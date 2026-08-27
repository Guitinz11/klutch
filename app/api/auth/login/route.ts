import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: "Informe email e senha para continuar." },
        { status: 400 },
      );
    }

    return NextResponse.json({ user: { email: body.email } });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível processar a solicitação." },
      { status: 400 },
    );
  }
}