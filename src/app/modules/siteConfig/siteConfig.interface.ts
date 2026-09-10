export interface ISiteConfig {
  // Fixed discriminator: this collection only ever holds one document.
  key: string;
  email: string;
  phone: string;
  facebookLink: string;
  whatsappLink: string;
  admissionLink: string;
}

export type TSiteConfigPayload = Omit<ISiteConfig, "key">;

export const SITE_CONFIG_KEY = "site-config";

/**
 * Seeded on first read so the public site keeps rendering the values it
 * shipped with until an admin overrides them.
 */
export const SITE_CONFIG_DEFAULTS: TSiteConfigPayload = {
  email: "muinulislammuin16802@gmail.com",
  phone: "+8801852-955611",
  facebookLink: "https://www.facebook.com/profile.php?id=61573213246773",
  whatsappLink: "https://wa.me/8801852955611",
  admissionLink: "https://docs.google.com/forms/not-found",
};

export const SITE_CONFIG_FIELDS: (keyof TSiteConfigPayload)[] = [
  "email",
  "phone",
  "facebookLink",
  "whatsappLink",
  "admissionLink",
];
