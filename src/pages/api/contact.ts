/**
 * API Route: POST /api/contact
 *
 * Recibe los datos del formulario de contacto, valida los campos,
 * y envía dos emails mediante Resend:
 *   1. Notificación al propietario de la web con los datos de la consulta.
 *   2. Email automático de confirmación al usuario que ha enviado el formulario.
 *
 * Variables de entorno necesarias (ver .env.example):
 *   RESEND_API_KEY   → API Key de Resend
 *   CONTACT_EMAIL    → Email del propietario (destino de la notificación)
 *   FROM_EMAIL       → Email remitente verificado en Resend
 *   CC_EMAIL         → (Opcional) Email en copia en la notificación al propietario
 */

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  // ── Parsear body ─────────────────────────────────────────────────
  let body: { name?: string; email?: string; phone?: string; message?: string; privacy?: boolean };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Cuerpo de la solicitud no válido.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, email, phone, message, privacy } = body;

  // ── Validación básica servidor ───────────────────────────────────
  if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim() || !privacy) {
    return new Response(JSON.stringify({ error: 'Todos los campos son obligatorios.' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email.trim())) {
    return new Response(JSON.stringify({ error: 'El correo electrónico no es válido.' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Variables de entorno ─────────────────────────────────────────
  const apiKey = import.meta.env.RESEND_API_KEY;
  const contactEmail = import.meta.env.CONTACT_EMAIL || 'andrea@macascore.com';
  const fromEmail = import.meta.env.FROM_EMAIL || 'no-reply@macascore.com';
  const ccEmail = import.meta.env.CC_EMAIL || '';

  if (!apiKey) {
    console.error('[Contact API] RESEND_API_KEY no está configurada.');
    return new Response(JSON.stringify({ error: 'Error de configuración del servidor.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resend = new Resend(apiKey);
  const now = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });

  // ── Email al propietario ─────────────────────────────────────────
  const ownerHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8"/>
      <title>Nueva consulta desde la web</title>
    </head>
    <body style="margin:0;padding:0;background:#F3F4F5;font-family:'Roboto',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F5;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
              <!-- Header -->
              <tr>
                <td style="background:#1F3E5A;padding:28px 32px;">
                  <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">
                    🔔 Nueva consulta desde la web
                  </h1>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,.6);font-size:13px;">${now}</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <p style="margin:0 0 24px;color:#5A7285;font-size:15px;">
                    Has recibido una nueva consulta a través del formulario de contacto de tu web.
                  </p>
                  <!-- Datos del usuario -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #E5E7E9;">
                    <tr style="background:#F3F4F5;">
                      <td colspan="2" style="padding:12px 16px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#8A8F94;">
                        Datos del contacto
                      </td>
                    </tr>
                    <tr style="border-top:1px solid #E5E7E9;">
                      <td style="padding:14px 16px;font-size:14px;font-weight:600;color:#1F3E5A;width:120px;">Nombre</td>
                      <td style="padding:14px 16px;font-size:14px;color:#5A7285;">${name}</td>
                    </tr>
                    <tr style="background:#F3F4F5;border-top:1px solid #E5E7E9;">
                      <td style="padding:14px 16px;font-size:14px;font-weight:600;color:#1F3E5A;">Email</td>
                      <td style="padding:14px 16px;font-size:14px;color:#5A7285;">
                        <a href="mailto:${email}" style="color:#D98B2B;">${email}</a>
                      </td>
                    </tr>
                    <tr style="border-top:1px solid #E5E7E9;">
                      <td style="padding:14px 16px;font-size:14px;font-weight:600;color:#1F3E5A;">Teléfono</td>
                      <td style="padding:14px 16px;font-size:14px;color:#5A7285;">
                        <a href="tel:${phone}" style="color:#D98B2B;">${phone}</a>
                      </td>
                    </tr>
                    <tr style="background:#F3F4F5;border-top:1px solid #E5E7E9;">
                      <td style="padding:14px 16px;font-size:14px;font-weight:600;color:#1F3E5A;vertical-align:top;">Mensaje</td>
                      <td style="padding:14px 16px;font-size:14px;color:#5A7285;line-height:1.6;">${message.replace(/\n/g, '<br/>')}</td>
                    </tr>
                  </table>

                  <!-- Botón responder -->
                  <div style="text-align:center;margin:28px 0 0;">
                    <a
                      href="mailto:${email}?subject=Re: Tu consulta en Macas Core Build"
                      style="display:inline-block;background:#D98B2B;color:#ffffff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px;text-decoration:none;"
                    >
                      Responder a ${name}
                    </a>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#F3F4F5;padding:16px 32px;text-align:center;">
                  <p style="margin:0;color:#8A8F94;font-size:12px;">
                    Mensaje recibido en Macas Core Build S.L. · Molina de Segura, Murcia
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // ── Email de confirmación al usuario ─────────────────────────────
  const userHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8"/>
      <title>Hemos recibido tu consulta</title>
    </head>
    <body style="margin:0;padding:0;background:#F3F4F5;font-family:'Roboto',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F5;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
              <!-- Header -->
              <tr>
                <td style="background:#1F3E5A;padding:36px 32px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">
                    ¡Tu mensaje ha llegado!
                  </h1>
                  <p style="margin:8px 0 0;color:rgba(255,255,255,.65);font-size:14px;">
                    Macas Core Build S.L. · Murcia
                  </p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:36px 32px;">
                  <p style="margin:0 0 16px;color:#1F3E5A;font-size:16px;font-weight:600;">
                    Hola, ${name} 👋
                  </p>
                  <p style="margin:0 0 16px;color:#5A7285;font-size:15px;line-height:1.7;">
                    Gracias por ponerte en contacto con nosotros. Hemos recibido tu consulta
                    correctamente y uno de nuestros agentes se pondrá en contacto contigo
                    <strong style="color:#1F3E5A;">en menos de 24 horas laborables.</strong>
                  </p>
                  <p style="margin:0 0 16px;color:#5A7285;font-size:15px;line-height:1.7;">
                    Si necesitas atención urgente, no dudes en llamarnos o escribirnos directamente
                    por WhatsApp. Estamos aquí para ayudarte.
                  </p>

                  <!-- Resumen del mensaje -->
                  <div style="background:#F3F4F5;border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #D98B2B;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#8A8F94;">
                      Tu mensaje
                    </p>
                    <p style="margin:0;color:#5A7285;font-size:14px;line-height:1.6;">
                      ${message.replace(/\n/g, '<br/>')}
                    </p>
                  </div>

                  <!-- Datos de contacto directo -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:20px;background:#1F3E5A;border-radius:12px;text-align:center;">
                        <p style="margin:0 0 12px;color:rgba(255,255,255,.7);font-size:13px;">¿Prefieres un contacto más directo?</p>
                        <a href="tel:+34613082506" style="display:inline-block;background:#D98B2B;color:#fff;font-weight:700;font-size:13px;padding:10px 22px;border-radius:8px;text-decoration:none;margin:0 4px 8px;">
                          📞 Llamar ahora
                        </a>
                        <a href="https://wa.me/34613082506" style="display:inline-block;background:#25D366;color:#fff;font-weight:700;font-size:13px;padding:10px 22px;border-radius:8px;text-decoration:none;margin:0 4px 8px;">
                          💬 WhatsApp
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:24px 0 0;color:#5A7285;font-size:14px;line-height:1.7;">
                    Muchas gracias por confiar en <strong style="color:#1F3E5A;">Macas Core Build S.L.</strong>
                    Es un placer atenderte.
                  </p>
                  <p style="margin:8px 0 0;color:#5A7285;font-size:14px;">
                    Un saludo cordial,<br/>
                    <strong style="color:#1F3E5A;">El equipo de Macas Core Build S.L.</strong>
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#F3F4F5;padding:16px 32px;text-align:center;border-top:1px solid #E5E7E9;">
                  <p style="margin:0;color:#8A8F94;font-size:11px;line-height:1.6;">
                    Has recibido este email porque enviaste un formulario en macascore.com.<br/>
                    Macas Core Build S.L. · Molina de Segura, Murcia (España)
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    // Enviar ambos emails en paralelo
    const [ownerRes, userRes] = await Promise.all([
      resend.emails.send({
        from: `Macas Core Build <${fromEmail}>`,
        to: contactEmail,
        ...(ccEmail ? { cc: ccEmail } : {}),
        replyTo: email,
        subject: `🔔 Nueva consulta de ${name} — Macas Core Build`,
        html: ownerHtml,
      }),
      resend.emails.send({
        from: `Macas Core Build <${fromEmail}>`,
        to: email,
        subject: `Hemos recibido tu consulta, ${name} ✔️`,
        html: userHtml,
      }),
    ]);

    if (ownerRes.error || userRes.error) {
      console.error('[Contact API] Error Resend:', ownerRes.error ?? userRes.error);
      return new Response(JSON.stringify({ error: 'Error al enviar el email.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[Contact API] Excepción:', err);
    return new Response(JSON.stringify({ error: 'Error interno del servidor.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
