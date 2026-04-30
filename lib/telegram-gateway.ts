const BASE = "https://gatewayapi.telegram.org";

export class TelegramGatewayError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "TelegramGatewayError";
  }
}

export type VerificationStatus =
  | "code_valid"
  | "code_invalid"
  | "code_max_attempts_exceeded"
  | "expired"
  | "request_pending";

export interface SendResult {
  request_id: string;
  phone_number: string;
}

export interface CheckResult {
  ok: boolean;
  status: VerificationStatus;
}

async function call<T>(method: string, body: Record<string, string>): Promise<T> {
  const token = process.env.TELEGRAM_GATEWAY_TOKEN;
  if (!token) throw new TelegramGatewayError("TELEGRAM_GATEWAY_TOKEN не настроен", "CONFIG");

  let res: Response;
  try {
    res = await fetch(`${BASE}/${method}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new TelegramGatewayError("Telegram Gateway недоступен", "NETWORK");
  }

  const data = await res.json();
  if (!res.ok || !data.ok) {
    const msg: string = data.description || data.error || "Ошибка Telegram Gateway";
    throw new TelegramGatewayError(msg, String(res.status));
  }
  return data.result as T;
}

export async function sendVerificationMessage(phone: string): Promise<SendResult> {
  return call<SendResult>("sendVerificationMessage", {
    phone_number: phone,
    code_length:  "6",
  });
}

export async function checkVerificationStatus(
  requestId: string,
  code: string,
): Promise<CheckResult> {
  const result = await call<{
    verification_status?: { status: VerificationStatus };
  }>("checkVerificationStatus", { request_id: requestId, code });

  const status: VerificationStatus =
    result.verification_status?.status ?? "expired";

  return { ok: status === "code_valid", status };
}
