PGDMP     '                    z            penjadwalan    12.11    12.11     !           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            "           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            #           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            $           1262    16573    penjadwalan    DATABASE     ?   CREATE DATABASE penjadwalan WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_Indonesia.1252' LC_CTYPE = 'English_Indonesia.1252';
    DROP DATABASE penjadwalan;
                postgres    false            ?            1259    16601    access    TABLE     ?   CREATE TABLE public.access (
    id integer NOT NULL,
    "user" character varying(20) NOT NULL,
    kalender character varying(6) NOT NULL,
    status character varying(10) NOT NULL
);
    DROP TABLE public.access;
       public         heap    postgres    false            ?            1259    16599    access_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.access_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.access_id_seq;
       public          postgres    false    205            %           0    0    access_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.access_id_seq OWNED BY public.access.id;
          public          postgres    false    204            ?            1259    16637    jadwal    TABLE     ?   CREATE TABLE public.jadwal (
    id integer NOT NULL,
    kalender character varying(6) NOT NULL,
    judul character varying(50) NOT NULL,
    tanggal_mulai date NOT NULL,
    tanggal_berakhir date NOT NULL,
    metode character varying(35) NOT NULL
);
    DROP TABLE public.jadwal;
       public         heap    postgres    false            ?            1259    16635    jadwal_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.jadwal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.jadwal_id_seq;
       public          postgres    false    207            &           0    0    jadwal_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.jadwal_id_seq OWNED BY public.jadwal.id;
          public          postgres    false    206            ?            1259    16589    kalender    TABLE     ?   CREATE TABLE public.kalender (
    id character varying(6) NOT NULL,
    judul character varying(30) NOT NULL,
    pemilik character varying(20) NOT NULL
);
    DROP TABLE public.kalender;
       public         heap    postgres    false            ?            1259    16574    user    TABLE       CREATE TABLE public."user" (
    nama_lengkap character varying(30) NOT NULL,
    ttl date NOT NULL,
    no_hp character varying(13) NOT NULL,
    email character varying(50) NOT NULL,
    username character varying(20) NOT NULL,
    password character varying(100) NOT NULL
);
    DROP TABLE public."user";
       public         heap    postgres    false            ?
           2604    16604 	   access id    DEFAULT     f   ALTER TABLE ONLY public.access ALTER COLUMN id SET DEFAULT nextval('public.access_id_seq'::regclass);
 8   ALTER TABLE public.access ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    205    204    205            ?
           2604    16640 	   jadwal id    DEFAULT     f   ALTER TABLE ONLY public.jadwal ALTER COLUMN id SET DEFAULT nextval('public.jadwal_id_seq'::regclass);
 8   ALTER TABLE public.jadwal ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    206    207    207                      0    16601    access 
   TABLE DATA           >   COPY public.access (id, "user", kalender, status) FROM stdin;
    public          postgres    false    205   @                 0    16637    jadwal 
   TABLE DATA           ^   COPY public.jadwal (id, kalender, judul, tanggal_mulai, tanggal_berakhir, metode) FROM stdin;
    public          postgres    false    207   ]                 0    16589    kalender 
   TABLE DATA           6   COPY public.kalender (id, judul, pemilik) FROM stdin;
    public          postgres    false    203   z                 0    16574    user 
   TABLE DATA           U   COPY public."user" (nama_lengkap, ttl, no_hp, email, username, password) FROM stdin;
    public          postgres    false    202   ?       '           0    0    access_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.access_id_seq', 9, true);
          public          postgres    false    204            (           0    0    jadwal_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.jadwal_id_seq', 4, true);
          public          postgres    false    206            ?
           2606    16606    access access_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.access
    ADD CONSTRAINT access_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.access DROP CONSTRAINT access_pkey;
       public            postgres    false    205            ?
           2606    16642    jadwal jadwal_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.jadwal
    ADD CONSTRAINT jadwal_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.jadwal DROP CONSTRAINT jadwal_pkey;
       public            postgres    false    207            ?
           2606    16593    kalender kalender_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.kalender
    ADD CONSTRAINT kalender_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.kalender DROP CONSTRAINT kalender_pkey;
       public            postgres    false    203            ?
           2606    16578    user user_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (username);
 :   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_pkey;
       public            postgres    false    202            ?
           2606    16612    access access_kalender_fkey    FK CONSTRAINT     ~   ALTER TABLE ONLY public.access
    ADD CONSTRAINT access_kalender_fkey FOREIGN KEY (kalender) REFERENCES public.kalender(id);
 E   ALTER TABLE ONLY public.access DROP CONSTRAINT access_kalender_fkey;
       public          postgres    false    203    205    2706            ?
           2606    16607    access access_user_fkey    FK CONSTRAINT     |   ALTER TABLE ONLY public.access
    ADD CONSTRAINT access_user_fkey FOREIGN KEY ("user") REFERENCES public."user"(username);
 A   ALTER TABLE ONLY public.access DROP CONSTRAINT access_user_fkey;
       public          postgres    false    202    205    2704            ?
           2606    16643    jadwal jadwal_kalender_fkey    FK CONSTRAINT     ~   ALTER TABLE ONLY public.jadwal
    ADD CONSTRAINT jadwal_kalender_fkey FOREIGN KEY (kalender) REFERENCES public.kalender(id);
 E   ALTER TABLE ONLY public.jadwal DROP CONSTRAINT jadwal_kalender_fkey;
       public          postgres    false    2706    207    203            ?
           2606    16594    kalender kalender_pemilik_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.kalender
    ADD CONSTRAINT kalender_pemilik_fkey FOREIGN KEY (pemilik) REFERENCES public."user"(username);
 H   ALTER TABLE ONLY public.kalender DROP CONSTRAINT kalender_pemilik_fkey;
       public          postgres    false    203    2704    202                  x?????? ? ?            x?????? ? ?            x?????? ? ?         ?   x?u?1?0??99 ?I??[?????1TP!?b??X ?ٿ????4?n??y] ?-?-tj@BĮ??]???8?x??ur?م?b??:?%hːMy?5?M?ݞ??w?????7!˦9??VHD??5??^G??w?}?|???PZ!?Zb%?SQk(9A??????J]     