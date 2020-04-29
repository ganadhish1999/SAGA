PGDMP     !    %                x            forum "   10.12 (Ubuntu 10.12-2.pgdg18.04+1)     12.2 (Ubuntu 12.2-2.pgdg18.04+1) r               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    17735    forum    DATABASE     k   CREATE DATABASE forum WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_IN' LC_CTYPE = 'en_IN';
    DROP DATABASE forum;
                postgres    false            �            1259    18219    category    TABLE     n   CREATE TABLE public.category (
    category_name text NOT NULL,
    post_id bigint,
    subforum_id bigint
);
    DROP TABLE public.category;
       public            postgres    false            �            1259    18237    chat    TABLE     �   CREATE TABLE public.chat (
    chat_id bigint NOT NULL,
    time_of_creation timestamp without time zone,
    user1 character varying(50) NOT NULL,
    user2 character varying(50) NOT NULL
);
    DROP TABLE public.chat;
       public            postgres    false            �            1259    18235    chat_chat_id_seq    SEQUENCE     y   CREATE SEQUENCE public.chat_chat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.chat_chat_id_seq;
       public          postgres    false    218                       0    0    chat_chat_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.chat_chat_id_seq OWNED BY public.chat.chat_id;
          public          postgres    false    217            �            1259    18198    child_comment    TABLE       CREATE TABLE public.child_comment (
    comment_id bigint NOT NULL,
    content text NOT NULL,
    time_of_creation timestamp without time zone,
    upvotes integer DEFAULT 0,
    downvotes integer DEFAULT 0,
    author_id bigint,
    parent_comment_id bigint
);
 !   DROP TABLE public.child_comment;
       public            postgres    false            �            1259    18196    child_comment_comment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.child_comment_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.child_comment_comment_id_seq;
       public          postgres    false    215                       0    0    child_comment_comment_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.child_comment_comment_id_seq OWNED BY public.child_comment.comment_id;
          public          postgres    false    214            �            1259    18175    comment    TABLE     �   CREATE TABLE public.comment (
    comment_id bigint NOT NULL,
    content text NOT NULL,
    time_of_creation timestamp without time zone,
    upvotes integer DEFAULT 0,
    downvotes integer DEFAULT 0,
    author_id bigint,
    post_id bigint
);
    DROP TABLE public.comment;
       public            postgres    false            �            1259    18173    comment_comment_id_seq    SEQUENCE        CREATE SEQUENCE public.comment_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.comment_comment_id_seq;
       public          postgres    false    213                       0    0    comment_comment_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.comment_comment_id_seq OWNED BY public.comment.comment_id;
          public          postgres    false    212            �            1259    18092 	   community    TABLE     �   CREATE TABLE public.community (
    community_id bigint NOT NULL,
    name text NOT NULL,
    description text,
    time_of_creation timestamp without time zone,
    creator_id bigint
);
    DROP TABLE public.community;
       public            postgres    false            �            1259    18090    community_community_id_seq    SEQUENCE     �   CREATE SEQUENCE public.community_community_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.community_community_id_seq;
       public          postgres    false    206                       0    0    community_community_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.community_community_id_seq OWNED BY public.community.community_id;
          public          postgres    false    205            �            1259    18058    feedback    TABLE     �   CREATE TABLE public.feedback (
    feedback_id bigint NOT NULL,
    content text NOT NULL,
    time_of_feedback timestamp without time zone,
    user_id bigint
);
    DROP TABLE public.feedback;
       public            postgres    false            �            1259    18056    feedback_feedback_id_seq    SEQUENCE     �   CREATE SEQUENCE public.feedback_feedback_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.feedback_feedback_id_seq;
       public          postgres    false    202                       0    0    feedback_feedback_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.feedback_feedback_id_seq OWNED BY public.feedback.feedback_id;
          public          postgres    false    201            �            1259    18255    message    TABLE     �   CREATE TABLE public.message (
    message_id bigint NOT NULL,
    content text NOT NULL,
    message_timestamp timestamp without time zone,
    sender character varying(50),
    receiver character varying(50),
    chat_id bigint
);
    DROP TABLE public.message;
       public            postgres    false            �            1259    18253    message_message_id_seq    SEQUENCE        CREATE SEQUENCE public.message_message_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.message_message_id_seq;
       public          postgres    false    220                       0    0    message_message_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.message_message_id_seq OWNED BY public.message.message_id;
          public          postgres    false    219            �            1259    18284    pending_requests    TABLE     V   CREATE TABLE public.pending_requests (
    user_id bigint,
    community_id bigint
);
 $   DROP TABLE public.pending_requests;
       public            postgres    false            �            1259    18136    post    TABLE     '  CREATE TABLE public.post (
    post_id bigint NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    time_of_creation timestamp without time zone,
    upvotes integer DEFAULT 0,
    downvotes integer DEFAULT 0,
    author_id bigint,
    subforum_id bigint,
    community_id bigint
);
    DROP TABLE public.post;
       public            postgres    false            �            1259    18162 	   post_file    TABLE     S   CREATE TABLE public.post_file (
    file_name text NOT NULL,
    post_id bigint
);
    DROP TABLE public.post_file;
       public            postgres    false            �            1259    18134    post_post_id_seq    SEQUENCE     y   CREATE SEQUENCE public.post_post_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.post_post_id_seq;
       public          postgres    false    210                        0    0    post_post_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.post_post_id_seq OWNED BY public.post.post_id;
          public          postgres    false    209            �            1259    18074    subforum    TABLE     �   CREATE TABLE public.subforum (
    subforum_id bigint NOT NULL,
    name text NOT NULL,
    description text,
    time_of_creation timestamp without time zone,
    creator_id bigint
);
    DROP TABLE public.subforum;
       public            postgres    false            �            1259    18072    subforum_subforum_id_seq    SEQUENCE     �   CREATE SEQUENCE public.subforum_subforum_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.subforum_subforum_id_seq;
       public          postgres    false    204            !           0    0    subforum_subforum_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.subforum_subforum_id_seq OWNED BY public.subforum.subforum_id;
          public          postgres    false    203            �            1259    18023 
   user_about    TABLE     G   CREATE TABLE public.user_about (
    about text,
    user_id bigint
);
    DROP TABLE public.user_about;
       public            postgres    false            �            1259    18121    user_community    TABLE     T   CREATE TABLE public.user_community (
    user_id bigint,
    community_id bigint
);
 "   DROP TABLE public.user_community;
       public            postgres    false            �            1259    18034    user_interest    TABLE     M   CREATE TABLE public.user_interest (
    interest text,
    user_id bigint
);
 !   DROP TABLE public.user_interest;
       public            postgres    false            �            1259    18045    user_qualification    TABLE     W   CREATE TABLE public.user_qualification (
    qualification text,
    user_id bigint
);
 &   DROP TABLE public.user_qualification;
       public            postgres    false            �            1259    18108    user_subforum    TABLE     R   CREATE TABLE public.user_subforum (
    user_id bigint,
    subforum_id bigint
);
 !   DROP TABLE public.user_subforum;
       public            postgres    false            �            1259    18010    users    TABLE     I  CREATE TABLE public.users (
    user_id bigint NOT NULL,
    username character varying(50) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(150) NOT NULL,
    password character(60) NOT NULL,
    dob date NOT NULL,
    profile_image_name text
);
    DROP TABLE public.users;
       public            postgres    false            �            1259    18008    users_user_id_seq    SEQUENCE     z   CREATE SEQUENCE public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public          postgres    false    197            "           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public          postgres    false    196            J           2604    18240    chat chat_id    DEFAULT     l   ALTER TABLE ONLY public.chat ALTER COLUMN chat_id SET DEFAULT nextval('public.chat_chat_id_seq'::regclass);
 ;   ALTER TABLE public.chat ALTER COLUMN chat_id DROP DEFAULT;
       public          postgres    false    217    218    218            G           2604    18201    child_comment comment_id    DEFAULT     �   ALTER TABLE ONLY public.child_comment ALTER COLUMN comment_id SET DEFAULT nextval('public.child_comment_comment_id_seq'::regclass);
 G   ALTER TABLE public.child_comment ALTER COLUMN comment_id DROP DEFAULT;
       public          postgres    false    214    215    215            D           2604    18178    comment comment_id    DEFAULT     x   ALTER TABLE ONLY public.comment ALTER COLUMN comment_id SET DEFAULT nextval('public.comment_comment_id_seq'::regclass);
 A   ALTER TABLE public.comment ALTER COLUMN comment_id DROP DEFAULT;
       public          postgres    false    213    212    213            @           2604    18095    community community_id    DEFAULT     �   ALTER TABLE ONLY public.community ALTER COLUMN community_id SET DEFAULT nextval('public.community_community_id_seq'::regclass);
 E   ALTER TABLE public.community ALTER COLUMN community_id DROP DEFAULT;
       public          postgres    false    205    206    206            >           2604    18061    feedback feedback_id    DEFAULT     |   ALTER TABLE ONLY public.feedback ALTER COLUMN feedback_id SET DEFAULT nextval('public.feedback_feedback_id_seq'::regclass);
 C   ALTER TABLE public.feedback ALTER COLUMN feedback_id DROP DEFAULT;
       public          postgres    false    201    202    202            K           2604    18258    message message_id    DEFAULT     x   ALTER TABLE ONLY public.message ALTER COLUMN message_id SET DEFAULT nextval('public.message_message_id_seq'::regclass);
 A   ALTER TABLE public.message ALTER COLUMN message_id DROP DEFAULT;
       public          postgres    false    220    219    220            A           2604    18139    post post_id    DEFAULT     l   ALTER TABLE ONLY public.post ALTER COLUMN post_id SET DEFAULT nextval('public.post_post_id_seq'::regclass);
 ;   ALTER TABLE public.post ALTER COLUMN post_id DROP DEFAULT;
       public          postgres    false    209    210    210            ?           2604    18077    subforum subforum_id    DEFAULT     |   ALTER TABLE ONLY public.subforum ALTER COLUMN subforum_id SET DEFAULT nextval('public.subforum_subforum_id_seq'::regclass);
 C   ALTER TABLE public.subforum ALTER COLUMN subforum_id DROP DEFAULT;
       public          postgres    false    203    204    204            =           2604    18013    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public          postgres    false    197    196    197                      0    18219    category 
   TABLE DATA           G   COPY public.category (category_name, post_id, subforum_id) FROM stdin;
    public          postgres    false    216   "�                 0    18237    chat 
   TABLE DATA           G   COPY public.chat (chat_id, time_of_creation, user1, user2) FROM stdin;
    public          postgres    false    218   X�                 0    18198    child_comment 
   TABLE DATA           �   COPY public.child_comment (comment_id, content, time_of_creation, upvotes, downvotes, author_id, parent_comment_id) FROM stdin;
    public          postgres    false    215   �                 0    18175    comment 
   TABLE DATA           p   COPY public.comment (comment_id, content, time_of_creation, upvotes, downvotes, author_id, post_id) FROM stdin;
    public          postgres    false    213   X�                 0    18092 	   community 
   TABLE DATA           b   COPY public.community (community_id, name, description, time_of_creation, creator_id) FROM stdin;
    public          postgres    false    206   ܌                  0    18058    feedback 
   TABLE DATA           S   COPY public.feedback (feedback_id, content, time_of_feedback, user_id) FROM stdin;
    public          postgres    false    202   t�                 0    18255    message 
   TABLE DATA           d   COPY public.message (message_id, content, message_timestamp, sender, receiver, chat_id) FROM stdin;
    public          postgres    false    220   ��                 0    18284    pending_requests 
   TABLE DATA           A   COPY public.pending_requests (user_id, community_id) FROM stdin;
    public          postgres    false    221   "�                 0    18136    post 
   TABLE DATA           �   COPY public.post (post_id, title, content, time_of_creation, upvotes, downvotes, author_id, subforum_id, community_id) FROM stdin;
    public          postgres    false    210   ?�       	          0    18162 	   post_file 
   TABLE DATA           7   COPY public.post_file (file_name, post_id) FROM stdin;
    public          postgres    false    211   ��                 0    18074    subforum 
   TABLE DATA           `   COPY public.subforum (subforum_id, name, description, time_of_creation, creator_id) FROM stdin;
    public          postgres    false    204   	�       �          0    18023 
   user_about 
   TABLE DATA           4   COPY public.user_about (about, user_id) FROM stdin;
    public          postgres    false    198   8�                 0    18121    user_community 
   TABLE DATA           ?   COPY public.user_community (user_id, community_id) FROM stdin;
    public          postgres    false    208   ��       �          0    18034    user_interest 
   TABLE DATA           :   COPY public.user_interest (interest, user_id) FROM stdin;
    public          postgres    false    199   ��       �          0    18045    user_qualification 
   TABLE DATA           D   COPY public.user_qualification (qualification, user_id) FROM stdin;
    public          postgres    false    200   �                 0    18108    user_subforum 
   TABLE DATA           =   COPY public.user_subforum (user_id, subforum_id) FROM stdin;
    public          postgres    false    207   q�       �          0    18010    users 
   TABLE DATA           s   COPY public.users (user_id, username, first_name, last_name, email, password, dob, profile_image_name) FROM stdin;
    public          postgres    false    197   ��       #           0    0    chat_chat_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.chat_chat_id_seq', 8, true);
          public          postgres    false    217            $           0    0    child_comment_comment_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.child_comment_comment_id_seq', 1, true);
          public          postgres    false    214            %           0    0    comment_comment_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.comment_comment_id_seq', 3, true);
          public          postgres    false    212            &           0    0    community_community_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.community_community_id_seq', 3, true);
          public          postgres    false    205            '           0    0    feedback_feedback_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.feedback_feedback_id_seq', 1, false);
          public          postgres    false    201            (           0    0    message_message_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.message_message_id_seq', 79, true);
          public          postgres    false    219            )           0    0    post_post_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.post_post_id_seq', 17, true);
          public          postgres    false    209            *           0    0    subforum_subforum_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.subforum_subforum_id_seq', 8, true);
          public          postgres    false    203            +           0    0    users_user_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.users_user_id_seq', 43, true);
          public          postgres    false    196            c           2606    18242    chat chat_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (chat_id);
 8   ALTER TABLE ONLY public.chat DROP CONSTRAINT chat_pkey;
       public            postgres    false    218            a           2606    18208     child_comment child_comment_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.child_comment
    ADD CONSTRAINT child_comment_pkey PRIMARY KEY (comment_id);
 J   ALTER TABLE ONLY public.child_comment DROP CONSTRAINT child_comment_pkey;
       public            postgres    false    215            _           2606    18185    comment comment_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (comment_id);
 >   ALTER TABLE ONLY public.comment DROP CONSTRAINT comment_pkey;
       public            postgres    false    213            Y           2606    18102    community community_name_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.community
    ADD CONSTRAINT community_name_key UNIQUE (name);
 F   ALTER TABLE ONLY public.community DROP CONSTRAINT community_name_key;
       public            postgres    false    206            [           2606    18100    community community_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.community
    ADD CONSTRAINT community_pkey PRIMARY KEY (community_id);
 B   ALTER TABLE ONLY public.community DROP CONSTRAINT community_pkey;
       public            postgres    false    206            S           2606    18066    feedback feedback_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (feedback_id);
 @   ALTER TABLE ONLY public.feedback DROP CONSTRAINT feedback_pkey;
       public            postgres    false    202            e           2606    18263    message message_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (message_id);
 >   ALTER TABLE ONLY public.message DROP CONSTRAINT message_pkey;
       public            postgres    false    220            ]           2606    18146    post post_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_pkey PRIMARY KEY (post_id);
 8   ALTER TABLE ONLY public.post DROP CONSTRAINT post_pkey;
       public            postgres    false    210            U           2606    18084    subforum subforum_name_key 
   CONSTRAINT     U   ALTER TABLE ONLY public.subforum
    ADD CONSTRAINT subforum_name_key UNIQUE (name);
 D   ALTER TABLE ONLY public.subforum DROP CONSTRAINT subforum_name_key;
       public            postgres    false    204            W           2606    18082    subforum subforum_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.subforum
    ADD CONSTRAINT subforum_pkey PRIMARY KEY (subforum_id);
 @   ALTER TABLE ONLY public.subforum DROP CONSTRAINT subforum_pkey;
       public            postgres    false    204            M           2606    18020    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    197            O           2606    18018    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    197            Q           2606    18022    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    197            x           2606    18225    category category_post_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.post(post_id);
 H   ALTER TABLE ONLY public.category DROP CONSTRAINT category_post_id_fkey;
       public          postgres    false    210    216    2909            y           2606    18230 "   category category_subforum_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_subforum_id_fkey FOREIGN KEY (subforum_id) REFERENCES public.subforum(subforum_id);
 L   ALTER TABLE ONLY public.category DROP CONSTRAINT category_subforum_id_fkey;
       public          postgres    false    204    2903    216            z           2606    18243    chat chat_user1_fkey    FK CONSTRAINT     w   ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_user1_fkey FOREIGN KEY (user1) REFERENCES public.users(username);
 >   ALTER TABLE ONLY public.chat DROP CONSTRAINT chat_user1_fkey;
       public          postgres    false    218    197    2897            {           2606    18248    chat chat_user2_fkey    FK CONSTRAINT     w   ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_user2_fkey FOREIGN KEY (user2) REFERENCES public.users(username);
 >   ALTER TABLE ONLY public.chat DROP CONSTRAINT chat_user2_fkey;
       public          postgres    false    197    2897    218            v           2606    18209 *   child_comment child_comment_author_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.child_comment
    ADD CONSTRAINT child_comment_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(user_id);
 T   ALTER TABLE ONLY public.child_comment DROP CONSTRAINT child_comment_author_id_fkey;
       public          postgres    false    197    215    2895            w           2606    18214 2   child_comment child_comment_parent_comment_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.child_comment
    ADD CONSTRAINT child_comment_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.comment(comment_id);
 \   ALTER TABLE ONLY public.child_comment DROP CONSTRAINT child_comment_parent_comment_id_fkey;
       public          postgres    false    215    213    2911            t           2606    18186    comment comment_author_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(user_id);
 H   ALTER TABLE ONLY public.comment DROP CONSTRAINT comment_author_id_fkey;
       public          postgres    false    197    213    2895            u           2606    18191    comment comment_post_id_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.post(post_id);
 F   ALTER TABLE ONLY public.comment DROP CONSTRAINT comment_post_id_fkey;
       public          postgres    false    210    2909    213            k           2606    18103 #   community community_creator_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.community
    ADD CONSTRAINT community_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(user_id);
 M   ALTER TABLE ONLY public.community DROP CONSTRAINT community_creator_id_fkey;
       public          postgres    false    2895    206    197            i           2606    18067    feedback feedback_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 H   ALTER TABLE ONLY public.feedback DROP CONSTRAINT feedback_user_id_fkey;
       public          postgres    false    197    202    2895            ~           2606    18274    message message_chat_id_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chat(chat_id);
 F   ALTER TABLE ONLY public.message DROP CONSTRAINT message_chat_id_fkey;
       public          postgres    false    218    220    2915            }           2606    18269    message message_receiver_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_receiver_fkey FOREIGN KEY (receiver) REFERENCES public.users(username);
 G   ALTER TABLE ONLY public.message DROP CONSTRAINT message_receiver_fkey;
       public          postgres    false    2897    197    220            |           2606    18264    message message_sender_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_sender_fkey FOREIGN KEY (sender) REFERENCES public.users(username);
 E   ALTER TABLE ONLY public.message DROP CONSTRAINT message_sender_fkey;
       public          postgres    false    2897    220    197            �           2606    18292 3   pending_requests pending_requests_community_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pending_requests
    ADD CONSTRAINT pending_requests_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.community(community_id);
 ]   ALTER TABLE ONLY public.pending_requests DROP CONSTRAINT pending_requests_community_id_fkey;
       public          postgres    false    221    2907    206                       2606    18287 .   pending_requests pending_requests_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.pending_requests
    ADD CONSTRAINT pending_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 X   ALTER TABLE ONLY public.pending_requests DROP CONSTRAINT pending_requests_user_id_fkey;
       public          postgres    false    2895    197    221            p           2606    18147    post post_author_id_fkey    FK CONSTRAINT     ~   ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(user_id);
 B   ALTER TABLE ONLY public.post DROP CONSTRAINT post_author_id_fkey;
       public          postgres    false    2895    210    197            r           2606    18157    post post_community_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.community(community_id);
 E   ALTER TABLE ONLY public.post DROP CONSTRAINT post_community_id_fkey;
       public          postgres    false    206    2907    210            s           2606    18168     post_file post_file_post_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.post_file
    ADD CONSTRAINT post_file_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.post(post_id);
 J   ALTER TABLE ONLY public.post_file DROP CONSTRAINT post_file_post_id_fkey;
       public          postgres    false    2909    210    211            q           2606    18152    post post_subforum_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_subforum_id_fkey FOREIGN KEY (subforum_id) REFERENCES public.subforum(subforum_id);
 D   ALTER TABLE ONLY public.post DROP CONSTRAINT post_subforum_id_fkey;
       public          postgres    false    204    2903    210            j           2606    18085 !   subforum subforum_creator_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.subforum
    ADD CONSTRAINT subforum_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(user_id);
 K   ALTER TABLE ONLY public.subforum DROP CONSTRAINT subforum_creator_id_fkey;
       public          postgres    false    197    204    2895            f           2606    18029 "   user_about user_about_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_about
    ADD CONSTRAINT user_about_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 L   ALTER TABLE ONLY public.user_about DROP CONSTRAINT user_about_user_id_fkey;
       public          postgres    false    2895    198    197            o           2606    18129 /   user_community user_community_community_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_community
    ADD CONSTRAINT user_community_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.community(community_id);
 Y   ALTER TABLE ONLY public.user_community DROP CONSTRAINT user_community_community_id_fkey;
       public          postgres    false    208    2907    206            n           2606    18124 *   user_community user_community_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_community
    ADD CONSTRAINT user_community_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 T   ALTER TABLE ONLY public.user_community DROP CONSTRAINT user_community_user_id_fkey;
       public          postgres    false    2895    208    197            g           2606    18040 (   user_interest user_interest_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_interest
    ADD CONSTRAINT user_interest_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 R   ALTER TABLE ONLY public.user_interest DROP CONSTRAINT user_interest_user_id_fkey;
       public          postgres    false    2895    199    197            h           2606    18051 2   user_qualification user_qualification_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_qualification
    ADD CONSTRAINT user_qualification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 \   ALTER TABLE ONLY public.user_qualification DROP CONSTRAINT user_qualification_user_id_fkey;
       public          postgres    false    197    2895    200            m           2606    18116 ,   user_subforum user_subforum_subforum_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_subforum
    ADD CONSTRAINT user_subforum_subforum_id_fkey FOREIGN KEY (subforum_id) REFERENCES public.subforum(subforum_id);
 V   ALTER TABLE ONLY public.user_subforum DROP CONSTRAINT user_subforum_subforum_id_fkey;
       public          postgres    false    207    2903    204            l           2606    18111 (   user_subforum user_subforum_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.user_subforum
    ADD CONSTRAINT user_subforum_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);
 R   ALTER TABLE ONLY public.user_subforum DROP CONSTRAINT user_subforum_user_id_fkey;
       public          postgres    false    207    2895    197               &  x�}��v� ���.�i� ��	�!d��������zI���?�.��\Q�"��[:!AHT�OcGit� Zm:��ҙ��Rp������Y����.�O��"�ޚ�r��n�,��k+꒜�zŲ),6���9)b����;�=�#�HAHٯ�Z�Rq�P�#<�o,am\?3������(Q�By��CvA»�X��rI�nJ�v8Xpsj���m3҅�q�5���Hxa��}w��[J��r_B����L����ni�l�4���8;F�u'��eǈ�!�c�.�6*��iG��=�         �   x�]�Q
�0�����J�MמE������ऐ�}ɟ��{���6������%� >#���ӻ��s��掹0
�7�jh0(���[6C�[\�0���;��' ��m��&	p���-a�M�˝�+?$jn:�%�-V�}d�5�/�<�u�N���$VJ�         4   x�3����4202�50�52W02�24�25�3��07��4 BcsN#�=... �i         t   x�U�=�@@�z�����0����1d�L���ҩy������k�v��:�"�©Vã7:RE����2��ܖ���"UkO6�����<��W�9ٓ�����?ß�         �   x�E�A�0F�u{�� BJ�Hؙ�-܌��&tj�a��׍q��=o.�t'���.�dsƣ��s�R� ���*���VSɕid�.T�yF�q�	�7)�4��U`��qC�Gt�ɻ�w��G�M?�[k�� �3�             x������ � �         �  x�u�M�7�Ϛ_19��")R�o��P�P$�'��F�;�ڋb���j�1�1��������"E���U���uʯ��,�sT5VO�(��!��ZLդ�������0o��c�L�j��t؝�902�X�6��I��9-d���S'4��H�و��2�Kd�MK��ŉ
GI1��jx�v��
WY!��:2�6M*Γ���Ҍ��5�A�\���1DF�7cyum����l����w�_����aw���A�8Z˂ ��G�������&���%���sx{����x�ߟ����{W�(�h�[*�#�����kRs/��몙`=��wď�"9�v����nH�	[UO�2Gp�;NW�U��<�r�@e��N��|؏��Hd�X�hCR.�1Zx~z��?>���?�q����������*��{�J�Wn{�sBh�WJC�;������+_��L���"5T�CHXW�7BR�ō*� �8���3�7��5��v�	�!
�Hc�(7.�e�o3Q��Dn��{�v�����!)��**�B�8D�P��u��� 0���)�P] g->�o���chh.�Zb�Ԁ�hh(Sr��K����Qoj�nr[��4���k��U�.d(w�
��)5���8@-!L��y=?gF��0׼�aPU�"��%Yu�%�P/��͂9%�"��V�K�Fd����_�^+G����]72�B���F��f����J�����@u�s�'+V�8*������iw�G�����~�·�bg��q�k�,d׃*o��id�=����T��K�jزc����|���Ǯ�"��a	��V��-۲��E�zmHXLkm�[ؚk��p�g)l�cF��r�g��1�┥-���1̸�8/�1���C��j���eqt!�ׯd],�9���fs��2�HC*v�ʐ#���V-/���m��Ҙ/|Br���w�"O�<���9�b	}����p�]H^ 9
q�eN�$�@"v$b�=���?-�$�Hح�w��~��8}=�;ڀ�L}%�<9`��)��:��h��2n#J�?c�Q�w�ǋ����.C)�K¡$��{ʣ*�v�&��5hdJ���N��*���!�J�������8��Q�{�            x������ � �            x����v�F�.�[�(��Y� 1��Z�$�:e%�eתri� 	+3�2Ef�{���?��G�a?B�!"�L<�i�S�L �{{��Η�T:ϻS1o�%�M;w���H,E!z�<sq*gr�t^�����w>_<8q*�@����_�N[;�9[�JG��<�S���3I�9M�v�j!+�Y�A?f����/���8b^9R�g�3�N:���%��ɲ����9qV��R̝^Jgy&����K�l;xZ��n�#����S����(WK1�w��c��8[�M	�����v�5,^�����?��ae>�];?}@��ټ�ٽϏԇ0n|[��4^�ө,iѡ1=�f���^���y�:|��a�+#�1��8�
L��L���)�����l��<}Z�v����#�����r�0�d&�y�9G�)����zg��nL�S��_�g͢Ǖ��:�D״+=��牴�l�����q�&�Bt0��Tt�5���/`�t73)�D~Md���''+�R�4 1����{�����-`K��`�^��60<�}��]�n)�'n@�+���Vԛ�?tF��j٭�媓������KrJ�&,�m�VmYM���	��M�,�-�l^�{惪y�r��ś���^���Ɵ�y��W�A��n�֙�Y�&�����A%�=�������F,��⍨����Syhh1�c�=xT��j�g�`I/���6��cX�9��= ��}oq�ղ��G�u{>7�s�˳�{�1LoԖ�STur{�.��ڏ�4��<��02�@Vg;�Э�7�j	_f�x��ś�K��Md����f�P�x�:y�E:m�өtZ�nM�{�g�*J���+O~���~y~Rɿ�}���=C0J�߶H�,|�z��t���w?p4xN5�Wu�gry��I&�]H�rȴZ�pT��UC�\�T �1��q�z'�K�m|�ЬO�/B'$>�m�Q�S� F�+����Eמvb6��ê�%T�o
�/��6�]g[��CG<�uΈ3��j:��N�1�jg���(:��5_M��y�
C&�|�Ϗ����R,�{v�G����z�S�+��(�x�H�b��;	|V���o��q�H�+V����g�U_�&2� �L�O�)���US��R�@G��Rs����%����Z�]���F"�(� ���3���6?Jf�^5�ġ�G;�?kX{�gKkC������4u���u�Ś��6oVO��i��G@�����0��1�o?�yQRt��;?k`���hZZ�[�/Jk�fz�����1�hMsk� �")��F��ϛ��e��9�;��򘙪��kN��g�������r�菏� �5��Tʷ=�,�<��G��0,��j1mE��ٛ���������Б�Lz���L��s�F[��o}#߾�'�ː��o���/c��e�'�nW�����^�C�k������
�'c�t�9��Z�C��j�h�Q{�/��Da�hSF�M���D k�Ł�뒱�����.z��h3F���Z��U�f|�'�IO�F5 V�V���Y�9��|�g�^�����F���8e<�}�� q������8p��um�b&���w�o 5,�f��[8�mG�~���$������,0x5�͎9K#�����j��C�>�|�'['8��}�󦥯yr�y�>G���Gm:�����3��� F��掿�ZF[�o&�Gt0jk�p�K�,5��
b(�2����+�M�؂r0��KRN� R0��-����#EI[�bDp�L3Y��|���N���p�����kP� w���  F���q5[���"���A �b͹�� ���w�У��x�Hjh�Ǒ�}�,�|�A*�����\���-�wԖ�kxp7�/y��@�gp;��[і�ל�� �F->k���  g���0[1�� а74��֫�t�l`R#�Y�*KzkBЃ�}j58��RJ���[ÇK�!e�[j�G��3WV ���h��u�4NʹY�qq�D��wzF�͍���d~B8�e�>g�0#�W1��L^��R���5��f`Eۼ�制mzuBMl;�����m����bM߱iy�ze����Y@CE�I��8���l�d���ʳ	�	� �N�)`��>���JqaΕ����^+Yw�LYE`�stX�[����L�{ x5Fzm~�����t�Q�M�ȡi5xŕh��
�H�G	l(nڲ͔����zK�_Ǟ?R��%́���k�;Kd������bLM[;��_��E�!�34Y�e��R�;�l %1_�
T��y�>�H`��lvC�ʇ˨��-k�scːa�>r��M��)��
u�gQ2k4�'��FX�TI�͕�1�	��s��|Ǐ���8��8���N���;��<���.�s2y�K> *��͝�Wj�#�����7b~�B�B{x]5��Q�����S4g��$[���V�fnS�6��'E�q�|�N��9Q Z�P�688�*I-J`{�h��`>�[[`����7zf� =��;���4%$����>�zST�i�6xNT�?mାz��㇯'η/��~<q�|L?��0�/����_�_'�͐w��5 5Ĉ0�b�܂�7O�}�����M>:�ō�C��9��dœX���y��J�ٴ�i��St�YG9�U�"o�z��@c�k$x���vg|����]����?� ���=phE����	�JQ"�{�Ƨ'4�W��:q^����9t�ښ� �vv#���*�ֳ�9���.�ඏ��8�ְ����T-a6�.xk4�)����Ť�l�z>��6Md�Ղ�X+�I���d��N�׵_�wh�@уf
�QQ}��S��ʑ�xZ�+/qY5d�-��.&fq���/�է�Oۜn�����+���5�N@��7G�@(�u6Ug�� n�\�N֞��1V1Hؠ�U?���س^���׃͗Y��7O�|��7o�=7OM�7�N�>���ɣG/�z��_?6�Al�����J��bW˭��ܞ�Dy&��=�8�d������WI �Gn�����	�$;��`��p�7i�<G� ���b��cG�c����j��E[�կ��Y��D�cb�6��GP�AR@C�M���{.;s�-�h�����i�����s�)�s�l1ɬA~���#�C7�)��2�;���.Z�A{�M/O��p�ۯ�>z���O>��<�c?�x��n�
���}�5>x>���_}�1+�շ/�:y��5��(��(�����z��n�Я���'�?f�^>���ɟ?j��8i�C���)�4��%}������ �4M�<������G$m�l�R���\t�����'_|���w�r@t�٢�dS�(i-��i��"5�8�
�0|��p��:�<��?�gl�W:����yI�Vm;�������n��v��
T,kH�1:F9�m�����|�z�_�0^Q��l��%CE�D�P?!���7P�V��@�àэ�p��4Zx$O;in�`F�^E��U��l��K�IӒ��0]��Ż�����;��cǴ66�!�w���QZ�8�Ρ�i�Z\� �\��Ev'����㝘�`�hyI��H���2^���&9tz��LAM��O!�ٱ����� �ô�+��u^�>q����r����;@�2�3��Sf�m?R��R,�iK�؜��-h�z�Ǧ!��Fq�@��V۾��3�-�g�M� �)#�C�}′�<|�ͷO�M�G/��P6�a(J6,i���
ׯE�FY久�27�e�U��e�K�n6�����X������(��5��lX������f�!�}*��b���d;�O�V[��=y�����@���y�v��&��p�>�Kǡ�����P�'c���u���L)]9,��c�u*��2J�k��SQ�b'�h���w�sG,�������<y���3�l���b�p^>:4�ҟ�>;��i��w����iaZ����/-$��V��~���W/�����o���?0�}}��'Ͼ���%�>���K�ݝ�>z���?��    �˭�0�f����p�D����q�<��ȼ���Y�+}p�}g�bZ�����3��?�>��i�ޡ��m�V��m�7h���
 `�2p�p�?d7�Z���4��03���vU�50��R��k�U$�%8;y)ի.'6	a+t�L�Ӡ�f��+ �s&9���@��e����'��j緎B4~ѳ�����ֆ{��v��/�����7���Z�W�*��[߽b�W66��)��~�F6�_l;��:�c�/6��������[q�1�xrp=O�0F�j3b���R�O)Gl��v��� 䲑~v��l��O�s��U��g_�QJ��'�'���ρ:y��	o r0�d :V��D��x�?P)��"�.|F!g��Gր+������㠿ǆ6������������{���s��g���OI������s�;z*iQ?йB�7���*m{ñ��!am0���:>�9c��6�)���;�1�-˃=߲�[V�{��ow��,��W��{4ӯ�����gX�[�u)к<kG�@Fj�uG_�O�杘J�W?~����e*�J�]M9�e�� �s7�;{G/�NK;���z%���	�RBP:͠WbR ťL�2�0�枏�ќ���^��<J��#��sr����Ș��FT�}\Dpy�7�`���-���{��78�@�6U���<�_?19Ȁ�%�j\�c�[3Wz�/d�	�+��S��5�'$K%{�Q�;�ϙ�qz��S��S��)�5Jೢ������'ϟ9_~#�_^YR'CsVk&��^Ȏr�fxV��2���ƀ1P�����E�Δ������.u%�eA��;�W����Ͽ}�zO�e3tۣ4J�f9�
�0)j��$W%���hx����{��>!��]������x�r�X�'b����ۧ��_;�DT\t�����r-����`��nB'�6���i�������D�FT�f=q�>y��|O���_�H6$�C�\�"F��+)�s�&���˪�s>��<fo�|ߢȯ�k��PI;�`1Y��u�H�@Qu�8RB�\�9�!X��<��5���nd�W�d���o@���A5����5����&x��w!�#��1!�;�bA�N�/�C��&��?��$���~E	��4�����~v?L8���5\���7�y��ˁ1�j������Mol�qQ7�����*N�Sؽ.���q3.�Q�� ���3�:N �fq�U�C�q�)����*��N�=�w�X��(/d���s@�i�NιB��)R�  �up�Y�]^�E�b�0#M�[�g�j( Z�q=U� �����Jz�o�T�}*��ų>�z,i�T�y1<�A���|g�%8n%4�%�(��zU�Ui�C� �ǾEY:��J%J���T���)�_��/%�� 2Ɲ�۹^��6��'x�z�P�m6v��Am�>�f׻��j��7'߾zl��qK�����r,�~�\��)�b���ܟ�kM7vs2C���&�+��1g�5A�h
PϜ�J��Kh1�B_R���E�p�\5z���{ T�i��J��P#kP�F�O��ۑ�H8g���J^���;�x����
Q�u]��`�����ޛ>|��P��޼�z.�+�}~$�T�Q�(����0	��K�� 6��,]��*]���*=a����Ŋ.��n�*�-T42:|�څ�f���?M\�SU�Д(D�Lug��2���Y�%�$Y��C�B���Y��p?h�A�Q���m9��rJ�售�O�-���8�-�����p[N鶜�o<z涜�m9��rJ������m9��rJ��>���rJ��n�)ݖS�-�t[N鶜�m9��rJ��v�z[N鶜�GU"�-�t[Ni' �-�t[N鶜�m9�K��m9��rJ��o嶜�N.|[N��ޖS�픨���t[N�&�n��m9��rJ6$�-�t[N���n�)ݖS��l嶜ҘVn�)ݖS�-�t[N鶜�m9��rJ��n�)ݖS�-���rJ�rJ̋0n}(��aa� >�����ܿ���ٝ�*�w�h�CH:�}\P	w��)�|R,TE����u�FY�"
7��4��:O
�$9�=��Q�C$ ��JɦF����m��:��vJ�q��E�Q,K7�d�f���A%i�dqU7�QX�i�/1o (4�=��=�,]+� =��rL�]C#|8+@vS$h�`�@�I��m!��=����¸�Kg�����lĔ�8;���=}̛�;��$^KynVU,@���7��8��8�������ן�f��8%���]�.��f�;<mG}�L ��ќ�s�'~�|�DV��nU���i^�Y�׮�0���P\���0�WXA��6��g�|�s$	xw�TvNC�$��Ɋ ��r_xnT��y�Fu�yEEur��a���K�7l�\0g����7Z�QfaG/&�����������ɾ�(����Ƀ	�!L�s�d����y�����Q!D]������fIR�EDA��̃k%��u�X`�%b(j�'��i�0Q�<�vֈS��ħ�TQUy���;7ʥ�c�Je�f�f�4�)�J�2�?�����gb�hz@�������k�f^TF"q#7
��͋"w��FQ�V׬Ab�**�Dy6��w����k����T�MŠ�3TQ��F���-���ϕ��̦瘱с
&��\>밒�_����wa�C�(�e�F��@"���:3(��1�e���N@�� �Kv-��j��hhZ�H��a>�,W�#�`�^覡�6�y�uX�q��ad�'���l4���B��^ls[:f���r�`|$??��h٠�d �`�]q��bEn��l�܃cP��[�2��<O��k&�orX�ˎ	��٪'��]1����L��M�$�����*��EZ_'ĽaH'Ġ�$Pr��f��LB�Je"����_�x6E��p�`'3(Z�����PO.�����c��x�[0����f�;����f ^/�D]�n���("1�J� J��(-�y(Vx~�<�B�d��vpF׎�{� J�e,� G�jU9È�-�4,BdW�\���� ΰ�"��<A�ɖT����O� �,�:�B���{�^
{_�nZYGq������o�M �쀭u��bzd�X��ġ��m�GO�j�|9ؐ��.r�@�(s�J0�	��P{������A��|z�쀔����zW@	?�� �Y&�;��yª����y
������!V�Ƴ�� tِ�XN����T\ ��"ԷG� ��� 4�%a��xz�Tx��<�2E^�e�h� �TP7�h���R���ݫ1��/���D^V d`zi-<?��(���%[n�ݷ������5^b�C$XS�Wc�),)�4
`�=����mm60�#�Z����f��S,	H(��|-A"N����
���9mY{�Ȣ�V����!�C�� �̘�9�����g�K`Z.ϥ�_�Ai�řC�JRa|WD�p����<�^��D#��"L~Dу����R�RG��ĥ�,�{ZQ�C�;�؊Z���O�	Y�x}�;�Kdu�xa5P����A\(�>+	�[bP�5"M���LH��G\%��DpH��mW�:?2-J�&~V���7�$��$��[v�:m�\ρ.��sXҙ/{����{��X^lag������>�S����~�Z��U��5���բμ�W��Ayy�¬=7��$���"��\�*,��4�67oz�P�|J�66 ����tf��)��B��JY���X��	}�ڻ$���x�$�������;<<�'X�t����)n�p�		��2����8��z����q��Y�̆Ҹ2yS;��x���~FI]��[��� n��<��2�$-��K}���P�����kK�N�	�}��I����y�ć��������$X�$6s���]+�&|0Ѷ�e���Yx����/^%�2t�<�S�����a� A+�YP�7�ﯵ �P��R�%�l	$��tF��u���RpaQ�Y7l�T��I����l9�    8�Y�r<,��g��=��*k�_�y�� ��&\� 8}8�^��yUƹ��S-Y���5 ��<�^yJix4p���7�7��}����l`Y�ebμ!�5-���7s��������~Y�0ըvE_ե�AaL˲�\� �!�E�~4���\sS�ы[E:nJtδ-z%)��+YeT�yҍ�Xe�p�J����An
>��&�%W,+��@	�䬑ʋ�������_e^\�i��� Fڪ��2Ɋ:����Wh���A\�������b�m6T��#��t��� �ن�I`C�M@��tz�=�s?\�+�C���e�Gn���϶G��E \r��oam��shN;w��Dڬ��KB`�1�+`�X��ؕq�.!I5��tM}+䪭��~v"�X��Z��ѭb�C\����]�xi�R�n��w*Ĕd6'���I5�т�����ф��7?��\�}���]�.���Jxc�=K첬���,�A;��dW��/ ǖ^(��y�ߵMe����z�<�s�������Ig�A�@��>�s8���h�+��������~��V��e��xp@��v~��[Il��O�P����ov0hd耠�r����?�0�u׹{O?�_��^��jʸpn�����ߥ�������4��u�iQ�Y�n�\�Q\XLc�M�8O���p�P �	R�AZ�F�E����L�����G��| "��q!��튉{,@v�C�4�R�Be�En���[T^��~�� {���P�VR��n��I:J�[S�#s�^j�Ϛ]��}:�Zth㱘��W�B@v2�A�$�B�N.bؒ,�e�U��e��e��^ae`�.;�td>h��kYP�3.P��;���A�50�I/W�ŐA�D��n	2�T���@�!�^9NHU#��*�h^��|@HE kWfe��4���Ȋ�p�]a���=43��L[�k�ՠ����3B��+w8��`�ۯ�3��)]��ξ!/e��X�t����^�6}A�$XY_L��&иFQ��c���lc��e��BC�x�Zy�LL�2����l�����!��;�����";;�N�~�Ǔ���J۽�9�-�!��H���5p�����´�� ��Tb��Z@}A�Zs,ݵ9+�β��U^C��n��:�z�.�����؏ЎG�:�ϵ!��â�\�Cv쾸��$�Z�I��^���y�7���,- ���׈'���`o4~+k�Ma��r�	U�U?(�_nr�]暺9])�QdEQ���t#�|��1�q*3_X���)��Mk�t���'f�_�\���e;;�ɪ�Z��.r�+�u�^{��mPn��l�fV�Q�I��@i]
�b	P0TQ�~TD�hfQ������6��Y �LJ7�:-�B��\�0�,��O3�8@�F53���f&=�<I��ePn�	��I]�yz%�du��hf�ױ�q3���93��Y�K��|�����L�[ =�ȋDX���|;_����8s�w:H��	�O����kG�b\�~��bÃ�n[�[_-W˶k��h��/�.���FK'2�/��p���� 4t)C�-,����l5=INQcT��R���Y��^i#��i�B?��.9�D�?�6�ހ<wS�l�;T]�$���&Q��E�,������r��Sq�=�_`�.ic���s�=T���%k��V���������9�{�%z��i@H
?�a��XmT±r���,�"+F���(�9�n\���s�������9���2ueT~�&A]g�ԙvj��P��: �<�U��[��������X��������E�o>��%2t�V/[��+B�rQ�i\�I�/��!(y ³�ȣ�/�Û�P�m�G?��)G�B�d�m�Ϣ�~�O�}-�^L��̫֍�®/��F.����1Z�=�*��ɍ�=>���#�F�l���۫����e� tlz��y��c���2O�u	��`��e]���l�X��xɜ}�>B�n7Dfl��;���U��Z���q�P���Ͳ�b����YoJE�p�F���9��ڂ0v��w���n�)�:;�Z>����v��-
�!��BG���0�R:>�B�{��90%�FV�Ӝ�����,WQ���nt��X?Uf5���;�t�,;*�(Mzduq����8p�<A�N�6`ݥ��^z���Bj��5
�JNXG�A���
�g&�
U��Bz����[�����*����j�We(���>yM2�h�:�#'�5QR�J=P�|�#����P��q^�婍@L�ٜ��L�)���̰�8v�.���j��Єd�H���r@�Q����d(-���^���F������L6r:g�x��9��c�
m8γP�u�~���_' ��<�dR'���OT���2���p0�TAV@���d�����#�BJp��11����9,
LW�8^�][�f�+��=xl���!��*CL��yT���1���y�~�<���밺.�w��\W��hd6�pCH�� �߈eu/, ���(���m	�X���>�FUr�fˆ���i5�"�Ih�5Zk�<��N:�b��^gkּ)� %�0X2J��"#��E c�}owT�My�%��+#�S���۫ax�@3I�3	��uQ���=!��/,,����s���B^�/�����ZI4�2*|���EQp������X�.����4v�_�2ϋ�,s��
15�[�ҭ�8/�(���ܜ�����И��Qr��)
 �:<s�r)	/��گ��R���r�y�n�˲e-��_JA@�ϖg_(��ŦC�P��r6<y�P�v�Vv��~v��agw<���落��{w�����;'�Chpf){Ԑ
� w>�@}�A����L���LX�D�z ��rI_��٢��ݐ��b ����@�,��4β��nI�Q��'P",�"Idlf}E�3d�
��n�ܷo�� �l:��
�
Qs��.���3����3N�&�'�V�0.|�S��&�"g&��j�Z��Hw�=�;�B<�@��̚1�\�K1դ���{K�;@�h�X�&�|ɍ�� ���`��ċC7�bLD*A�d�z"}�s2u�b.;����;V�QRuZ|�<`#��@�E>͓���[-!��{Β��?�R��y- [�y���ctw�.lYT�������9��?`��F�YU�a�[��-�e����*��*�,I�KǸզf�YT��� ۋ2)�T�
�/��P��׫��p�b�d�~0yx �D�/8H) Y'E��,�m��!�Zʌ#�Po�l��8��pc�L A"��� 3�j7*��^�q$K+�n��*�o���T-������O�[^���T���t7QsZ˴��0�"�H� Yfn\�, 4-#K_V�W���O��	�>2y+ʑ�N��FX��]��W� e�f^��``O"|���%1@�x/�<�0��ل��0Wc�B�5��v�>3���n4Y��$���������a!�J˹j8�[��ր�����m0N��ai�8∃����~�<��c�g���͐�\�I ��:��ǩ=��扛��D�Eץ�X��kN5�ua����2 nI�JUuh�2_�i��(0��GK'v7(��yZfB�N6��3�������hQ��|{]���Ѳ�؟�E�P�=o���r�pS�r��W#q�=p�Sh���&���Y0��E^�j\"(d^ř͓�(?�b\��Zm�"~1���%
� ӡ_�-V�W3�p}u�0�\ؒ�bj�Y�w�~y�q�D�iR�=�����3��b�&q&~�����ֆ���G�[L��0�/��:O�QiX�$�9���i�T��8nH��<��I`��#�r�{'�DV2)"Q~~u�,���42ܠ:�f�|)-),�ZM�M��8.��v��#U���@;]P�+���e��~p�|�&y4��ퟜ/T��sȈ)��x�4$�l�NH�8�N]
,ɖ    �l�͋8���&�v���� �֔�O�|4���v"A�~��`�sl��;T���3�z��8q,���0��US� ~״U;_[9�Dg`�?hs��2�ȯ�����`Lo���2fU��"LF�E�t><�t�����q9[,UH�Lv���:�v��y��&���$6,I���p:I��\�-��;�f�ְ��dۧ����?z�>���gx�H]l�Q�Apօ�F2D�/��"O�,�� J2k�����`��~�u��E���h��` ����>3X��)F�rx6�l��K��l��a;�X��&��c�`aj��f�Lݬ��,yR�+otb�v
���ݙ����nݣRBw�"�X���0�M|'��e�E�ƍ��(*��	ݦI),K)0"�VF��y+��_b-����--��2KK��p�<����0��]���<N��-U2�fyly'j�A^��JR|V�eT���e��2� �W9���ԭ��
��˃�V �D���0|ŭ��������'���IT���C�9r5�t�a�0|�?� U�I�|+�N�M�ܛJz0--����FԶkd� ``�O�E)I5���0C���ڿkt����?~�=��R�d�n�����
���;@9�R���v&��3Fm�p�)r3�Vi������쮞������WA��f���ཡ��i�2��8�Ȱ\/��uo��n0O�W�B�-q*�#��AK�Km^�}P5�
)��_>R��P{�e�nYh���)F���	ہ�Y�9��f*�Jʙ�0A�9�<(�Q��@VMO��c�)d:���ә)e��r����|�)��7�C��g����2pg��[��������LL���הG�q�ƾ�d��������ZM��'�i:߃rHHĐfC���Oe��_�=�*�:k����N%t���)SL^,�o��X�~���,i9]����Y����Dմ��YSv���\��'��X�ӑ��xѷ�}	��f�O��F��<P�����,���ګ#��+'�5W�)�H+b�r���N�dQ��9��'Tpv'�d:���Ht��P=p��P'��:d�, 8����d�� ���`,s\p��I�#1��J��B5#��Y�P��%�8�XlW3f�nG �	ނ5k�7�k������~O��&�N�<W]!�%���iC�4ޱ��O��p��֬��p�'�h�R��� Ǘ.Y����)%���ċ��[�j��Q�r��{����t�t�Y��b��UWt������Z�w�sK��$tn=1�R/<���Z�'�B�ؙ��Y�m�_6s��� �%P��l�|�:���Tr����r4�B칇�� f�[ө�u�;�ݓt�C��O���xyQW�k �55A�b�L����\�mP�V)]�貢�P7rZQ��P��xLO��j>���HCC^:$3��L���X5;Q�nDQTd���s�Ū�f��#3��t�s��k>ݠ�TČ4?�a�n��s�B��ڠvcY�*��ˍ��驾(�<f�]��.EF)Bu@���x6����h��,�{��ٺ�Y��݀&	��BE�j�Q�nx~���Gq�!���Q�8�7���'��?�ߝ.�{���lDG$�4�!Ǭ�G`o�=��>@��á�%�v/u}k��n_��RhnV@��V@ϣ@�+���ݰ⃩�?��iSt��qz�`�kkEU�����3릂CNlJx}&-b��;)tr�#4����7���H�C��p����_�J]a�����炔z�m�bbL��Gv&�z�⩕�C��$60�x��o��H��ķ%�9%J6�㥵�y!f�'�o�}���^Ւ���Ful/�a��c��D�Ƌ�SU���ep��ם@Y�tp��]M��4� 4?�=��}v*f3qO}�ɭݳx���N�U�z$�ޟC70�%]����gx�������Db)���u=c��Ϫ���F�x�q/h7��,7J;&B�@�H8~��̔ Q#�8�� ~*��`xz�/��k�LPSe+�0&�fܼ���/î[� (�J,H�C����-[����0O��k pBMQտþ+�6.^LlG,�ѐk���D����j �K	#!��L#�ǅX�>Gه���f��&vݠ��(Y�3��}cX��=G��VyJA�����R�P�gx��i�y�q�?��*V�!�Q ����䚧���>Ku�7�4/�!�1K�#���M6�%�V�T?�T����⑸Uj��y�p9`��$vc?͙��6�%N/�q����Ị��ۢ����]A<n���Jgh�+���KD&��9n4O2V9�/j�����)�����W��}q��h�y���<���Z�kW��}df�+��{N3�Wu����5��k�m����9Q�������l�A�^5�a5�
�a����`���p�4�< M	 �({�)�DEj��h��Q�WF�:�-������@���cb5o����5l�|P�����	�j�>^�ӖO2´S�~��YU���ff�����\?|
w'gC�H�؇�}�2���=[�����鴀�UP��
�㵪 7j�
���>���S,NR���_wB����P肶�?6�i(����0�$����R�9y���!j;=���+���c�M˶�4ui�<��h��'gZ�0bE��)Rv{J�4F�E�S�I\�d��B�Xa4�)�$WkAb)�R ek$��f�U�Ɛ�CS�p+�!_khC8S_Aյ��^38��Mt�ٴ�*WmM┰�؈�ڌ'�A�Qތ���a��a����I��="-g�.�/\�d(�]�+
�8����� �#��}1�4��*�>�*�wJ�>�K��
X$4N��/��=-�ԕ�N�ᭆ.��;b�l�G�lR|�1�0WbeY����>��������$� /�l�X��FVcb_$�T�T֐�N��2� �B�((Z��(�b�*�!���/t�0˚c S�К�y�T��R[�+�2
�`8dF��;z'�����#ҳ}�b���H;}Յ)���x�����*��n����٬��=��E�-����`�X�h�FY"�1���NC����yzvse?%=��6>n��{��L�sU���lJۈ(��
du�VS�6���;0B���o���z�F�fП�9F:x���Gn�֙�Y�&�����A%�����ɋ7���p����Q�B�(
>����»=����޹X<{�1LoԖ�STuh��\�b�����'�i�%t6��ы7|�I��� ���l@jA���7��iۂS��`���^{�C4�ۇ_���Z���ߞ�����Poɀ�]����et�u�,2�m]�3��f��'�l�����0��y�Tt�%N���'q��p�ϖ*z� �����&�DB["����э�:��ފZ4S��j���{��@
:\��1��*j��]է�_��?���������m�M(d��ՊZ��;�Z���ih��;v�-(��ب��xZ\�B4�4�O��S��7��"�$f@����N���9�=�J�=msY������6�:����9�ߗC����0�!�I���W�:�H��&�mc�6�})�A^�Yݻ����.\7�SS��55�WP�c�!B�s�<G�#zu���,F��=�k�����\Dͅ�67������a,�}2���� �|y�)VG+�����.s*� ��p���~�:�|ҷ\�de�*|
�ΰ� n���� !ڢ���tmtYش����։�Y�.�3��}��XQ}����)K���l�;�ay�^����g�~�/�b#��86�y�_d�K9���^�n������]��|ؐMi{�h�ǋ=��P�b::�}�;I�Tߪh�JGd�`�bO�vp�ts82Fu0�z���w�(Nv0p��Q�>���F3�:lH�������.�-C� p��P�m(n@}%ӎU1tdv��L��/�a硆�iL�	���$�rl0�	58�����Me�eS˵]�ŤגgHX�    # ߸�ɿ�'������\oc4���������<�@���w�y��)p��%m����a��g�x0|1����M{�o��`[��� yln:� �i˂ZE��7�S��`*W���Ej�TP�0SUvn�Y���H�����5g�M
r�#��N=Zu�h����o.�Z}��}�th!XT��V�ew?��JM��Sq�U�1DԖ=�Ӂ��R�Z�/M6�PqE$�D���9=L�Q����묖q�sPZ�ѮL�^L��ʺ��`�#� Rꄍts+�r3R�:s �u"T�B��wxۂ�q���̷ ����iV~M���L����K�܋>�Q# �N̄_Q7��I�[�J����A�*P
���D�k�5��L����&q�{	��՝�~x�Ŕ�5���'��i^�DJ7��č|��Y��n%�8Ȫ�O"+@~��eڽ�M!�<�TQ�2�^��ɪcWfQ�{Q D*7Sȏt��mo*���	I����Oԩ��Tw�bj,G��)r����L�	ڕ�s���A�
FS�ofPE���n&R��˺���~V�I��(���$m�y.��������ͼI�ER�(N;I{���eg����a��"�
��+/�_�0�N�6r�1'Te~{��aUxe�,��K\��p�2O���7��$m���7�7��Ҹ�d�)ޙe9�?d�E^Pgi&����͛���0#�Fwj?�,�`Z��V��亂"p�<�|)�"��d����W�*r����\T��&	�&J�,�73ƉU���*���eY�I�"�r�K2,���~�faV'u�g�A�{A��(-	koP����'�a.���[ƄNʊ��|��He:��U�|G��DDsu95G�?��+�̺?�4�W[�A�Xm%���A���I�UU^�W"������%����/�����{��c^f~y���x����a�Y�IzI(�d(�N��o�Wy%\	f_-�����P�"�s^4 ��2���`6�Y��G�Ҍ���g�K�����Q�u�S�E*B7+b��H*�NJ�P��>�i؀ky�+S���	��m{��d��� k�ϰ�H!|��XZ���$J;���H�`QX�}��� ���*~���{���V�O>�E�$x�0�g�%H�ȍ��0��",�;���K��~�T[���?l�� �ኦu�r1�.��P*k_�}����v-�TK<L���,:��a��y=�U�:�x::-_A=L�2������M��:�)B*A(2,�:/�$�i.2� *�OwW��:=WO���.tb�ɣ�LNwg��1p�f6\J��p���-�VZ�ʶ�t"3��N[+�n)t8�u�}#�F��t��Ƿ[��Y�P��M���	�BP\�zU�^-FE���z%�K�@D���Ϲ�Ï�Z,���0���q\ ���k� ����m���G)��T�Y�יo߄��^M�R���ӏ�9!�*�iIw�T58� �+� (���t#b�^�cg,k�=kCb��Y�o\eb�wO����)x��U)U�q�qJU�$*�*U)UѝGrF������CD���)��:]�9�s�{��Ep*�Jto�R	;�TӯS��2��@шI�iDY	������~�[���yJ^�ń�:&rJ4?��tN�_�FXR��qb�������g4��-�����)f�P�ȥ�G]5C
+1��P1�G
�ѹ.|�V�b
�j�;L�+�Y�V����˦�ʒ���cf�Vh1Ͼ����m�^�\<��uh�E��<�|G��u�V0�.�&T�F��E���o*k	i�k�#qi��3�Q���}�v�p����*�jFY�l��[M�✔c�g���u��X��6��Sw�0���%%8��6=DxO۶R!�8�{��ӕR}^�x�T}Xu�XLEks�^��,���,u��Y�,н�+V��ڹ�0e]H`E����<ޱ��,%6�	�A�sZ|x���3E��o�*��O��ȝ@7&"$�P4N�M���zUɊv�,�;6�c��M����z	�6�Fs&�4�E�ۇ���U`uM?�;�|��w�z5��X��U�N���W�����b���&�{zAl���^I����,h�Vp����3���D>�������n߹>-Ţ`Zu�E�m����h�4E;FWrr䬽��q
B,$�0sC�T��7��􅇸�FE��k��Κ� ��Y��P�0:Lݥ8M��45l�����[hw���촓�7��%���`�#��[�L͌�Σ��6����8��
�쓙ӥn	��� � ?M�|�v�+�?��}*H�����93�X�c![Z&��k�55��^��}\���Nv�T��KL!���a�=�����$[m��.�ػ�%h�_���o*�8G��{��!����������)9�z`��
>S!����%�^Ҵ�Ӫ� �K��!'���%pT�v�#�.(oؗ�����N�ȾX�a����������L��i��V0k17���q��yA�L��ShSv��Ȟ)7�W���^��z(��؞��v�Ȯk7��v�k�k�|�v�kǛP�ׯ��Z�#k�����:�YI<���f����Y�Ei��*}a�רc�����\�ui��Sِ3 �ʄ-M����T��k[-�� \���b+�͘<���LN��A��2�R��4iTG|�t���Wf��]C��|��&�������8�e�=�q�l���,T0����l������TR��n��D���|�]��s�i�n?m���^�gc���/��!�x���2#���n�'�cA%wŔ�ed�Fs�ׅ�zT�#�E񕒄�X�<���d�ߎ@ղl]M��h��߭�@Wo��7��خ��X3ew<�kp��9�;����-���� Q�o��w�`��Q�}GW��mT�D�\)���g�{�������d�*(��X����V�[L֘�x��4$������>�dכ֚)R{�ءT&�
s�n� H��8O�},�!�H"]�G͉#�{T�Q�4)L���j��z��Eī�v�+=�Su٦d���`���Ď�Ҽ��u�m�L��7W�O((�H9C/��s*�gX������v�*J��Z��	�a�![E���M�����ة�נ��^�,� �0"~F���66�)gR�w��jƥNX�@u�����FNU��7��l�kNYP#<<�� '0N����ڀ�n"Y�<p3����ܼ�ģ���MZ���ɐ���m�0���)�1*�ʒI�%r���	�����D� 2��\-� "���(�)b~	h����A���F�X~H�-��m���W t��m6dzՒ������V�/YV�6PK��G����$xP]CK&RUʏ��l�g�t�F�aT�o(���c"W�Ո��ny�r�a�D3�3�'K��
��-��M��쥅5l�fj	't�鉳V���Ķd&��u�rgL����`h5Qa�'J��M����$lYw��K��rh[�n�y��Y@)��`aG �^:�q3յ�D(�Zm
�.�DAfUg�����(�z��74Vb�-�dڡ���L�|]i@A��k����(�h8��HG��ˬ\�6ٞ
°�{V��=r!��Jk����k,{�^���g�,���Xׄh�l�sZ}iN��m�=�����m�~<�y�(w0�?�X�w�n��+��+kفs���[�f[�֞�9�sG.7E)T^�J��6՜X_s�)�Fa+�,��2��f��������u�N�;���aW*�z���ߜf8k��rl��h�F��㓢��5�'t�#�ZJ��S�TK)��ao&:E�[�hc��
�K�5Vv,�h�l���z����b�:
湐?S{ç*��Z	2C�%�WLt�Z��{��O��c��R��V9:I�ӱkt$cx  aH��dCJ����>M��hz�fNXz-`vƮ�[�8�ƕ����Ek��!@�s
 ����Qᯆ��c�s,����Pۃ�e`�Ǧ��ذ�k�ꜛs#3,��3*bTddK�: �  �J3C%���t|�7�S���a�(DE��_,U�@nS9E�[�j�X�B�$���WV�L+cƵ7:v�a�����V��lW��-���%�Xʅ��� �����5��~��$��Ggc,�\z�\e�2���a��)5<��B�8� �f�p8�jט��0s$��z"B8�Ƞ�	S[)�;!ok�vT�Z{����X��r��]�p1�:��ǫ�J�� h�6�4Ң���D�����
�0	�*/M93K�f�w
�/����7@K�a1��o���G��i�@��*9/��������b��E�u�<����f3*1n5Ή
�X�4��/]�%�i�P4s|2��AIvT���^���y��qA�֔_�h.�_�~�&	ϖ3U� o0��'����o�bڔo��8<Xj�M��s�~f���jD�t7�03�m����C���CGg7j,��pv�x0rx�����3�O�����6#�lNw�S<�����v�,a�sd��(���L��>("<��I1C��0P#��<d~�ʴ��ڪ.d�Dk�դ��f>�r�B�Tms>pt��v�\���Ŕ��;��χ��	���O�w��a��3�����U9�TBW�؎�|)���K?B�b�9ذI]��A�~��	������,wK��:\_��H�͏�m��R�����	�u�����VUO�����gS�_س�	�&�j�02��W4�_F��F�� �����}*�Ԣ\�Mt������h�G�J]�3mh�kH�9��E�Q.������6���L�~i��~�]���k_Z��ő\�
j�N�P���6����e7�A��wM�ĵ�R����y���6ʕ�:�
�q�Ҵ[��f��Q�3Ϣ�b�J�8߽�C#�n��<���+��<����TU��H�eb���n�2�0`nM�ʰ%�/�f���vo�m,G��N�%<��D�NY��C��ޮ�x	ƶSz����A̌#c���*8�� ����T��_�+�ǪN��WS�c�I^5�_�gj���0~��B�ʀ�j�lAY*p�(�|ͅ9_�]|ۋ`4.�Ϊ�2�ZG�����[�]1� �겺CY�,=�3�r/Z��j%N���mq�!���c�+a�))������dU�8�c�R*�:(Yt��f�U�w{MƦxU�s6p)��+���`#����[���s1�	��%�m1��H�W�I�|:�a˰g�]�vVa�r�p~0ɓ�^��	���i=�B�	�o�U�@� =mPUX���b��V�9�\FGL��§�MМ/�1��(`�v���.������5���ey�vq�J��vG�a�zA��#.P���NN��AL�n.�C�b�ߓ6j5=�� 8�,��;>��C����q�������'�      	      x������ � �           x����j�0���S���8N��V�\
�>�.j�$���3�=��B�R(찋B���`G�F��h;�=�r�_�
�^�@�uZH#�=���H;�gm!L
��w��V�ܰN�N.��˭� �MV4B��(*.�Lr��OH
���L��ME�_ăU�p�J.��fy��жp��Hw�L'�Ռ����}p�hm�h;�'�0D��HkGm�ZW6��-������ꦨR��U-Y^'%{qfVA���߻Dt�U��·5�����UM�7�Le)��X���$I~ ���+      �   s  x��U�N�@>�O1P�
�zD���&&^�����ΐ�-���	��(�����g;���� I���7��2�(UZc  �-��Mqr-�%|X��´��|,�^;�5����R��Pb�9F���^�
0◔l�+�e�:��n.޵�&�����o���A�HF�P�c�3ٝ��)��s���WU��w��0#�`qR[�N�EUn��(]��� �.H��4��V�d�7~�h�{הM�ޝ��լC�%6�T6����>,�rϬ�B��-���ۥ9<CT�����"�[�K��H�iL�&6��.�>�|��6����O���N%��Y��k�s2��x��lpuf<b��'�>I6��o�<Ͽ +�            x�3��4�21�@"F��� D�      �     x�uU˒� ]�2թ桭��E*5U��2tkF�=I�}.+��\�yH#���F��`�6(��|�RU#)��� �\�PvPwX����	/��d�&�7�ޠ���0���\�mflsc�m2�ɂϙ�	FI�sީ��Hb���NL��lb���NL���iC�|,�mo_�~y��O�k��N�CO4�h"j�Ƿ�y�A�e�N��q#�a��ȓ΅�G.x�xy�,5XT���_���F�<�L=�+���tk��5ۂ�=��AoP7����:Y)z�G}:��|p�;n�8��są@|�C ��	t=H
��0��@��D#�B ;d�U\ա�����]u6���٭�����i^�}���O��˛�MX980G��>��N��(��}L����w��M��Mn}\馑^��a%�7��6#K�*��zr���zy��m����������ϫ�o�k94�_ n6l�=��4J�(?/ؒRλ�Ҷ�%E��B� ���      �   ^  x�5��n�0Dg�_ZĢcY��M��(���
�d(���G/|�I�HY��i96���)��NN�[���NK��� 3�0,����u���Z�̵.@]��2�0h,r���P+��;� �Єs���$Ìl����E�E�*V���!��lX���`J���6]�3�=ȱ/?a�⁝n��E*��{V��az�4�5���R�J\�dԯ��.�c���ya�X��]ސ}���=�L�݁Y�O��P��@���n�B�Z;�߮&o� �E����P�:����8%���[)�B0����xʿL�҅鲥���w2��׿��k~���cm:��W����            x�36�4�21�4�\�@"F��� .dc      �   �  x�mXY���}��W܇ymd_�\QQ��FLP,��*��[`/�̍�C2��S��y��)p>55�KTN���h�E�E�'�V�%�М$�N9>��@y�ia7���=�-iܗKэ��� MR�E0���j�OM�!���d��)�Q���"t��K�t�+���^=╕���~��Kg�@}0d������S3�BP傲�sR/���Ƽ��wOr*u�AQ�g�Yf�W��1�a��0 � Fe +���������0���QvoŔ|�y�_�k,��(�ț{Fz�
�jΒ��4U�U��c��$?H�Rǁ��0�I��U"p�o���E�}����;-�k-��<y:*�N�ڛ�����k�,;.����W��W-W�h@I"�A�$ף� �TV���O/��?�;'+߁�m͎��m+݅`�mNz5b���^bk+����jj�ZzE=�v�+��x���X �]d1r��@������C7��;<�\}h��с�JYY�~[֋]X{ϥ6s��6�x2;�yr�/�Vt_F��+���EP���²d���6**pz9~"c�.S���{:���U[n*ŀ�����V�Uv��	�/�ˑ�l�8z��s㰾-����Q&�"�����e�?z�Lj��\�1*�S�^��=���U��-5��=��$��E�I�3�I]����=E���a�����]�
`�<?�����̳�}���ۼ���՞�)�Y$�a���P��V�țKq:"':r;��>+���^���:FT�ͧ��{��NY�Ԛ��o��,ӯ�Z�P��S�@;����Q^�v^����A�=�w�(�N֠���)��l0��c�s��>���V@�u+�*cM�h&�Βŵ�G��u:��-� �mN .����\��-����}`�ڶq;�^�O`�6���]?���� oV�b�daL�>2E����8�r���Ϳ��M߄�ކC�΢?;�b1,�N�m�o�7��c'�gU�u�����Z�q��Dd� dG��Gź;q�d>�|�ZF|n-�l�^�V�7�A
$;�s .#;*H�A�g�O�[h%�g�w���}�� /�H��D]]��ҡ|��:���z�ڞ�ĂS�uK�ɢO;�tl�У�1V�2;0�/�8�Efկ���>�ؼ��|D#����u����F[V���;�&�C>�ˡ�ď��X��V$0k7���/�Od��\�_Y���U���h�'&��w���@w}N�)K-��4�GS:m���a฿��k89*��	(0ù�b�{�?�q �W�;���+�^=u���CD����}i��`��3����ŭH5d^W�Sy���C�x	nb�.�Y˾�el��q���p�u�rz�Z�K���K�*`V}�-q=j��������M�8���Qe�"̤MR{^�2�c�:!���Wa��,�á̉:��5�/g볯�[�#3�j�J'Ow	�/�DH7�cv�U�k#Gߩϧ3li�`�����[�%.�:^C����yy��b����'6MeA=�pF\�릺�B������	v�����08�*��i���V�b\��K������ӭ����V�T�9�.�n�Z�Mآr;�(�y�����N:�F����m` }�*�6,qvy0]ܤ����y�@=��3tx���ik�Ucq�-X_o&j+��g��.[(�֭d&�1(�o���,N��
X��q�l�����7��wl���6\{���o��j�]7'c:�{�/h�j��f�v9l����rN�Fs �&��,l���_yރc�.j�[%�m┼y]�f($S�2�7|MN�ǣ���s�Qa<3:Lo����H��}�N�@54\����d�d�_���\��q�թ��Y���A#r�'�ʄy���)Z����b�����}��.�w�q�^����:�J��*����֧o��"s��g�%������\J07d�;͚`��<_ryLL�,:�cZ�]���>���r�u���a�𿦀���>ͷ�؏3;�%�/�Z9f���6�+Z��Z_�GuVg�t��/�����Uބ�e�N�O����-˦�8�1��"�p�Ͼ|���_��{�PN�\�+.��o+�\h5�h�R�V�Hs5��P���������r�x_OP�!2̓���Zo}9�UVy��iUz�H��K�+�%����urJ҇Uk�w���"���bo�V�f�k��K�"�8�������]o��~��1"P�=˕5��C'�m�	5��r��z�)��H[�L�s�Κm3���ͳ���&�L5�vЏΒ�/=���c���{uބ�E�Ȕ�!=��.g��#)��N�*��n���MI곒Oy�8Qб�~�N�k�3@��c�����̷��´�bXH�A��вFY&w�0_�(�Qߍ�QP��4��b;k����;_��3>9��
x�1L����c�F���g>!�مQM�fyͻ
��5�����R����v��&l��)�FC��=ɾ�:Á[��>ޜ牸�c�R�}yރ�6��"��y6�Mn>˲�d�A�Ηt�tvy�z��FYKY��b�ԵH��pOz��ax m��s��v���-B����Wx�UPۿ��ŷ�ea�ՙ��do��[���=Z�;Z�6;~+6O��*��@	,��!,	�v�A�2��g`��{�ˍN����>��
�ԉg5���!t��	��P3Òs;�"��g�>��%���9`|G��p��K,&�`ei���36�'��D�H��@
i�ޚqY/��`���{ĮެM)�M���<�>�;�ߙ�N	c���(�<KI�$
�-����a
]�#�J	,�,0���E� ����O���ʷS�z�R����5O�YqG��A�{8�jdN�Ɯϔ�[�G��P�[������a�4(!�+���!�{��+|�����*��%(�)���QMi�ngYqm=�fe>�xB*��R[؎����"�6O���%0�ۋ����ȸ��9{;���(�g2=>����Y�:�(��d�d��&���;�^�ԅU��������D�di�!��b$��v� �WX$l�_To�b��?�'S�1�UV�#��q�%��j��W;��[�M��,E��WN�����(�d���ap��	�8��[�`�F&���Hݬ�[�~��.��z��x�qyuN���&�-@R4�3��4P��s�P��K����T��     