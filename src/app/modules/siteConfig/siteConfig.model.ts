import { Schema, model } from "mongoose";
import {
  ISiteConfig,
  SITE_CONFIG_DEFAULTS,
  SITE_CONFIG_KEY,
} from "./siteConfig.interface";

const siteConfigSchema = new Schema<ISiteConfig>(
  {
    // Unique key enforces the singleton: a second document cannot be inserted.
    key: {
      type: String,
      required: true,
      unique: true,
      default: SITE_CONFIG_KEY,
    },
    email: { type: String, required: true, default: SITE_CONFIG_DEFAULTS.email },
    phone: { type: String, required: true, default: SITE_CONFIG_DEFAULTS.phone },
    facebookLink: {
      type: String,
      required: true,
      default: SITE_CONFIG_DEFAULTS.facebookLink,
    },
    whatsappLink: {
      type: String,
      required: true,
      default: SITE_CONFIG_DEFAULTS.whatsappLink,
    },
    admissionLink: {
      type: String,
      required: true,
      default: SITE_CONFIG_DEFAULTS.admissionLink,
    },
  },
  {
    timestamps: true,
  }
);

export const SiteConfig = model<ISiteConfig>("SiteConfig", siteConfigSchema);
