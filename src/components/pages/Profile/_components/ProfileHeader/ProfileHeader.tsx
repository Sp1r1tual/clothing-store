"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

import { getAddressAction } from "@/actions/address.actions";
import { updateProfileAction } from "@/actions/profile.actions";
import { Link, useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button/Button";
import btnStyles from "@/components/ui/Button/Button.module.css";
import { Input } from "@/components/ui/Input/Input";
import { ConfirmChoiceModal } from "@/components/ui/Modal/ConfirmChoiceModal";

import { PhoneSection } from "../PhoneSection/PhoneSection";

import { useAuthStore } from "@/store/useAuthStore";

import { CARRIER_LOGOS } from "@/common/constants/images/carrier-logos";
import { getSupabaseBrowser } from "@/common/utils/supabase/client";
import {
  CARRIERS,
  type CarrierType,
  ProfileFormData,
  createProfileSchema,
} from "@/common/validation/profile/schemas/profile.schema";

import styles from "./ProfileHeader.module.css";

export const ProfileHeader = () => {
  const t = useTranslations("Profile");
  const router = useRouter();
  const locale = useLocale();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState<{
    carrier: CarrierType;
    city: string;
    warehouse: string;
  } | null>((user?.address as never) || null);

  const schema = useMemo(
    () =>
      createProfileSchema({
        nameMin: t("validation.nameMin"),
        nameMax: t("validation.nameMax"),
        nameRegex: t("validation.nameRegex"),
        phoneMax: t("validation.phoneMax"),
        phoneRegex: t("validation.phoneRegex"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      carrier: "NOVA_POSHTA",
      city: "",
      warehouse: "",
    },
  });

  const carrier = useWatch({ control, name: "carrier" });

  useEffect(() => {
    getAddressAction()
      .then((addr) => {
        if (addr && CARRIERS.includes(addr.carrier as CarrierType)) {
          const addrData = {
            carrier: addr.carrier as CarrierType,
            city: addr.city,
            warehouse: addr.warehouse,
          };
          setAddress(addrData);
          updateUser({ address: addrData });
        } else {
          setAddress(null);
          updateUser({ address: null });
        }
      })
      .catch(() => {});
  }, [updateUser]);

  const startEditing = () => {
    reset({
      name: user?.name || "",
      phone: user?.phone || "",
      carrier: address?.carrier || "NOVA_POSHTA",
      city: address?.city || "",
      warehouse: address?.warehouse || "",
    });
    setIsEditing(true);
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      const trimmedName = data.name.trim();
      const phone = data.phone?.trim() || "";

      const updatedData = await updateProfileAction(
        {
          name: trimmedName,
          phone,
          carrier: data.carrier || null,
          city: data.city || null,
          warehouse: data.warehouse || null,
        },
        locale,
      );

      const addrData =
        data.carrier && data.city
          ? {
              carrier: data.carrier as CarrierType,
              city: data.city,
              warehouse: data.warehouse || "",
            }
          : null;

      updateUser({
        name: updatedData.name || trimmedName,
        phone: updatedData.phone || undefined,
        address: addrData,
      });

      setAddress(addrData);

      toast.success(t("save") + "!");
      setIsEditing(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      router.push("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to log out";
      toast.error(message);
    }
  };

  if (!user) return null;

  return (
    <>
      <div className={styles.profileHeader}>
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.form
              key="edit"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit(onSubmit)}
              className={styles.editForm}
            >
              <h2 className={styles.editFormTitle}>{t("editProfile") || "Edit Profile"}</h2>

              <div className={styles.formGroup}>
                <Input
                  label={t("nameLabel")}
                  {...register("name")}
                  error={errors.name?.message}
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>

              <div className={styles.formGroup}>
                <Input
                  label={t("phoneLabel")}
                  type="tel"
                  {...register("phone")}
                  error={errors.phone?.message}
                  placeholder={t("phonePlaceholder") || "+380..."}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <span className={styles.carrierFieldLabel}>{t("address.carrier")}</span>
                <div className={styles.carrierGroup}>
                  {CARRIERS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`${styles.carrierChip} ${carrier === c ? styles.carrierChipActive : ""}`}
                      onClick={() =>
                        setValue("carrier", c, { shouldDirty: true, shouldValidate: true })
                      }
                      disabled={isSubmitting}
                    >
                      <div className={styles.carrierLogoWrapper}>
                        <Image
                          src={CARRIER_LOGOS[c]}
                          alt={c}
                          fill
                          sizes="24px"
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <span>{t(`address.carriers.${c}`)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <Input
                  label={t("address.city")}
                  placeholder={t("address.cityPlaceholder")}
                  {...register("city")}
                  error={errors.city?.message}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <Input
                  label={t("address.warehouse")}
                  placeholder={t("address.warehousePlaceholder")}
                  {...register("warehouse")}
                  error={errors.warehouse?.message}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formActions}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    reset({
                      name: user.name,
                      phone: user.phone || "",
                      carrier: address?.carrier || "NOVA_POSHTA",
                      city: address?.city || "",
                      warehouse: address?.warehouse || "",
                    });
                    setIsEditing(false);
                  }}
                  disabled={isSubmitting}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting || !isDirty}>
                  {isSubmitting ? <Loader2 className={styles.spinnerIcon} size={16} /> : t("save")}
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className={styles.viewProfile}
            >
              <div className={styles.avatarWrapper}>
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={90}
                    height={90}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>{user.name.charAt(0)}</div>
                )}
              </div>
              <div className={styles.profileMeta}>
                <div className={styles.nameContainer}>
                  <h1 className={styles.title}>{user.name}</h1>
                </div>
                <p className={styles.email}>
                  <span className={styles.label}>{t("emailLabel")}</span> {user.email}
                </p>
                <PhoneSection />
                <div className={styles.addressSection}>
                  <span className={styles.label}>{t("address.sectionTitle")}:</span>{" "}
                  {address && address.city ? (
                    <span className={styles.addressValue}>
                      {t(`address.carriers.${address.carrier}`)} · {address.city}
                      {address.warehouse && ` · ${address.warehouse}`}
                    </span>
                  ) : (
                    <span className={styles.addressNotSet}>{t("address.notSet")}</span>
                  )}
                </div>
              </div>
              <div className={styles.headerActions}>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin/products"
                    className={`${btnStyles.btn} ${btnStyles.primary} ${btnStyles.md} ${styles.profileBtn}`}
                  >
                    {t("openAdmin")}
                  </Link>
                )}
                <Button variant="secondary" className={styles.profileBtn} onClick={startEditing}>
                  {t("editProfile") || "Edit Profile"}
                </Button>
                <Button
                  variant="danger"
                  className={styles.profileBtn}
                  onClick={() => setIsConfirmLogoutOpen(true)}
                >
                  {t("logoutButton")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ConfirmChoiceModal
        isOpen={isConfirmLogoutOpen}
        onClose={() => setIsConfirmLogoutOpen(false)}
        onConfirm={handleLogout}
        title={t("logoutConfirmTitle")}
        description={t("logoutConfirmDesc")}
        confirmText={t("logoutConfirmYes")}
        cancelText={t("logoutConfirmNo")}
        isDanger
      />
    </>
  );
};
