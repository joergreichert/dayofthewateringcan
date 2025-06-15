CREATE TABLE IF NOT EXISTS "public"."waterings" (
    "id" integer NOT NULL,
    "properties" "jsonb",
    created timestamp without time zone,
    "geom" "public"."geometry"(Point,4326)
);

ALTER TABLE "public"."waterings" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."waterings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."waterings_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."waterings_id_seq" OWNED BY "public"."waterings"."id";

ALTER TABLE ONLY "public"."waterings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."waterings_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."waterings"
    ADD CONSTRAINT "waterings_pkey" PRIMARY KEY ("id");

