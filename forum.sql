--
-- PostgreSQL database dump
--

-- Dumped from database version 10.12 (Ubuntu 10.12-2.pgdg18.04+1)
-- Dumped by pg_dump version 12.2 (Ubuntu 12.2-2.pgdg18.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

--
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    category_name text NOT NULL,
    post_id bigint,
    subforum_id bigint
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: chat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat (
    chat_id bigint NOT NULL,
    time_of_creation timestamp without time zone,
    user1 character varying(50) NOT NULL,
    user2 character varying(50) NOT NULL
);


ALTER TABLE public.chat OWNER TO postgres;

--
-- Name: chat_chat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_chat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chat_chat_id_seq OWNER TO postgres;

--
-- Name: chat_chat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_chat_id_seq OWNED BY public.chat.chat_id;


--
-- Name: child_comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.child_comment (
    comment_id bigint NOT NULL,
    content text NOT NULL,
    time_of_creation timestamp without time zone,
    upvotes integer DEFAULT 0,
    downvotes integer DEFAULT 0,
    author_id bigint,
    parent_comment_id bigint
);


ALTER TABLE public.child_comment OWNER TO postgres;

--
-- Name: child_comment_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.child_comment_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.child_comment_comment_id_seq OWNER TO postgres;

--
-- Name: child_comment_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.child_comment_comment_id_seq OWNED BY public.child_comment.comment_id;


--
-- Name: comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment (
    comment_id bigint NOT NULL,
    content text NOT NULL,
    time_of_creation timestamp without time zone,
    upvotes integer DEFAULT 0,
    downvotes integer DEFAULT 0,
    author_id bigint,
    post_id bigint
);


ALTER TABLE public.comment OWNER TO postgres;

--
-- Name: comment_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comment_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comment_comment_id_seq OWNER TO postgres;

--
-- Name: comment_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comment_comment_id_seq OWNED BY public.comment.comment_id;


--
-- Name: community; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.community (
    community_id bigint NOT NULL,
    name text NOT NULL,
    description text,
    time_of_creation timestamp without time zone,
    creator_id bigint
);


ALTER TABLE public.community OWNER TO postgres;

--
-- Name: community_community_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.community_community_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.community_community_id_seq OWNER TO postgres;

--
-- Name: community_community_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.community_community_id_seq OWNED BY public.community.community_id;


--
-- Name: feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedback (
    feedback_id bigint NOT NULL,
    content text NOT NULL,
    time_of_feedback timestamp without time zone,
    user_id bigint
);


ALTER TABLE public.feedback OWNER TO postgres;

--
-- Name: feedback_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.feedback_feedback_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.feedback_feedback_id_seq OWNER TO postgres;

--
-- Name: feedback_feedback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.feedback_feedback_id_seq OWNED BY public.feedback.feedback_id;


--
-- Name: message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.message (
    message_id bigint NOT NULL,
    content text NOT NULL,
    message_timestamp timestamp without time zone,
    sender character varying(50),
    receiver character varying(50),
    chat_id bigint
);


ALTER TABLE public.message OWNER TO postgres;

--
-- Name: message_message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.message_message_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.message_message_id_seq OWNER TO postgres;

--
-- Name: message_message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.message_message_id_seq OWNED BY public.message.message_id;


--
-- Name: pending_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pending_requests (
    user_id bigint,
    community_id bigint
);


ALTER TABLE public.pending_requests OWNER TO postgres;

--
-- Name: post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post (
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


ALTER TABLE public.post OWNER TO postgres;

--
-- Name: post_file; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_file (
    file_name text NOT NULL,
    post_id bigint
);


ALTER TABLE public.post_file OWNER TO postgres;

--
-- Name: post_post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.post_post_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_post_id_seq OWNER TO postgres;

--
-- Name: post_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.post_post_id_seq OWNED BY public.post.post_id;


--
-- Name: subforum; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subforum (
    subforum_id bigint NOT NULL,
    name text NOT NULL,
    description text,
    time_of_creation timestamp without time zone,
    creator_id bigint
);


ALTER TABLE public.subforum OWNER TO postgres;

--
-- Name: subforum_subforum_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subforum_subforum_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subforum_subforum_id_seq OWNER TO postgres;

--
-- Name: subforum_subforum_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subforum_subforum_id_seq OWNED BY public.subforum.subforum_id;


--
-- Name: user_about; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_about (
    about text,
    user_id bigint
);


ALTER TABLE public.user_about OWNER TO postgres;

--
-- Name: user_community; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_community (
    user_id bigint,
    community_id bigint
);


ALTER TABLE public.user_community OWNER TO postgres;

--
-- Name: user_interest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_interest (
    interest text,
    user_id bigint
);


ALTER TABLE public.user_interest OWNER TO postgres;

--
-- Name: user_qualification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_qualification (
    qualification text,
    user_id bigint
);


ALTER TABLE public.user_qualification OWNER TO postgres;

--
-- Name: user_subforum; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_subforum (
    user_id bigint,
    subforum_id bigint
);


ALTER TABLE public.user_subforum OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id bigint NOT NULL,
    username character varying(50) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(150) NOT NULL,
    password character(60) NOT NULL,
    dob date NOT NULL,
    profile_image_name text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: chat chat_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat ALTER COLUMN chat_id SET DEFAULT nextval('public.chat_chat_id_seq'::regclass);


--
-- Name: child_comment comment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.child_comment ALTER COLUMN comment_id SET DEFAULT nextval('public.child_comment_comment_id_seq'::regclass);


--
-- Name: comment comment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment ALTER COLUMN comment_id SET DEFAULT nextval('public.comment_comment_id_seq'::regclass);


--
-- Name: community community_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community ALTER COLUMN community_id SET DEFAULT nextval('public.community_community_id_seq'::regclass);


--
-- Name: feedback feedback_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback ALTER COLUMN feedback_id SET DEFAULT nextval('public.feedback_feedback_id_seq'::regclass);


--
-- Name: message message_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message ALTER COLUMN message_id SET DEFAULT nextval('public.message_message_id_seq'::regclass);


--
-- Name: post post_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post ALTER COLUMN post_id SET DEFAULT nextval('public.post_post_id_seq'::regclass);


--
-- Name: subforum subforum_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subforum ALTER COLUMN subforum_id SET DEFAULT nextval('public.subforum_subforum_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (category_name, post_id, subforum_id) FROM stdin;
dbms	2	\N
computer-science	2	\N
information-technology	2	\N
sql	2	\N
database	2	\N
sql	3	\N
dbms	3	\N
database	3	\N
information-technology	3	\N
computer-science	3	\N
programming	\N	2
computer-science	\N	2
computers	\N	2
database	\N	3
computer-science	\N	3
sql	\N	3
physics	\N	5
entrance-tests	\N	5
jee	\N	5
sql	6	\N
database	6	\N
database-management	6	\N
computer-science	6	\N
information-technology	6	\N
database	8	\N
database-management	8	\N
computer-science	8	\N
information-technology	8	\N
competitive-programming	\N	7
computer-science	\N	7
algorithms	\N	7
data-structures	\N	7
competitive-programming	9	\N
computer-science	9	\N
algorithms	9	\N
competitive-programming	10	\N
computer-science	10	\N
algorithms	10	\N
data-structures	10	\N
physics	11	\N
wave-motion	11	\N
database	12	\N
dbms	12	\N
database-management	12	\N
computer-science	12	\N
competitive-programming	13	\N
computer-science	13	\N
algorithms	13	\N
data-structures	13	\N
stack	13	\N
Economics	14	\N
\.


--
-- Data for Name: chat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat (chat_id, time_of_creation, user1, user2) FROM stdin;
1	2020-04-18 23:31:06.751421	u1	u2
2	2020-04-18 23:34:22.56029	akshatshah21	u1
3	2020-04-19 00:02:03.615362	akshatshah21	u2
4	2020-04-19 00:03:35.751023	akshatshah21	u3
5	2020-04-19 00:04:26.29566	u1	u3
6	2020-04-21 17:56:03.961722	rpioli4	u2
\.


--
-- Data for Name: child_comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.child_comment (comment_id, content, time_of_creation, upvotes, downvotes, author_id, parent_comment_id) FROM stdin;
1	hi	2020-04-27 22:11:50.088758	0	0	37	2
\.


--
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comment (comment_id, content, time_of_creation, upvotes, downvotes, author_id, post_id) FROM stdin;
1	Nice post	2020-04-27 20:21:34.878547	0	0	37	3
2	Next comment	2020-04-27 21:48:33.504967	0	0	37	3
\.


--
-- Data for Name: community; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.community (community_id, name, description, time_of_creation, creator_id) FROM stdin;
2	Database Enthusiasts	A community for students, enthusiasts and professionals in the amazing field of database management 	2020-04-28 17:20:21.434502	38
\.


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feedback (feedback_id, content, time_of_feedback, user_id) FROM stdin;
\.


--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.message (message_id, content, message_timestamp, sender, receiver, chat_id) FROM stdin;
1	Hi!	2020-04-18 23:32:22.556256	u2	u1	1
2	...	2020-04-18 23:32:26.086397	u2	u1	1
3	iih	2020-04-18 23:34:45.557541	u1	akshatshah21	2
4	Hi	2020-04-19 00:01:44.757168	akshatshah21	u1	2
5	hi	2020-04-19 00:02:38.461269	akshatshah21	u2	3
6	hi	2020-04-19 00:02:46.957081	akshatshah21	u2	3
7	Hi	2020-04-19 00:03:30.04405	akshatshah21	u2	3
8	Hey	2020-04-19 00:03:37.667283	akshatshah21	u3	4
9	Hey Akshat	2020-04-19 00:03:58.440244	u1	akshatshah21	2
10	Hey U2	2020-04-19 00:04:03.486749	u1	u2	1
11	Hey U3!	2020-04-19 00:04:30.785396	u1	u3	5
12	Hey U3, my name is Akshat	2020-04-19 00:05:12.694344	akshatshah21	u3	4
13	My name is U3	2020-04-19 00:07:09.052301	u3	akshatshah21	4
14	Nice to meet you Akshat!	2020-04-19 00:07:15.602907	u3	akshatshah21	4
15	You moron	2020-04-19 00:07:54.086929	akshatshah21	u3	4
16	Hey! This is a message!	2020-04-19 00:18:13.632685	u1	akshatshah21	2
17	You idiot!	2020-04-19 00:18:51.907075	u2	akshatshah21	3
18	Not the same to you	2020-04-19 00:19:23.083047	akshatshah21	u3	4
19	The ordering of messages doesn't work!	2020-04-19 00:19:38.178847	akshatshah21	u2	3
20	No	2020-04-19 00:19:44.379728	akshatshah21	u1	2
21	1	2020-04-19 00:19:45.905281	akshatshah21	u1	2
22	2	2020-04-19 00:19:46.111996	akshatshah21	u1	2
23	3	2020-04-19 00:19:46.307478	akshatshah21	u1	2
24	3	2020-04-19 00:19:46.512067	akshatshah21	u1	2
25	3	2020-04-19 00:19:46.858015	akshatshah21	u1	2
26	4	2020-04-19 00:19:47.057392	akshatshah21	u1	2
27	4	2020-04-19 00:19:47.271274	akshatshah21	u1	2
28	5	2020-04-19 00:19:47.491097	akshatshah21	u1	2
29	5	2020-04-19 00:19:47.67511	akshatshah21	u1	2
30	6	2020-04-19 00:19:47.883536	akshatshah21	u1	2
31	7	2020-04-19 00:19:48.074899	akshatshah21	u1	2
32	7	2020-04-19 00:19:48.25642	akshatshah21	u1	2
33	8	2020-04-19 00:19:48.445742	akshatshah21	u1	2
34	8	2020-04-19 00:19:48.643636	akshatshah21	u1	2
35	9	2020-04-19 00:19:48.990254	akshatshah21	u1	2
36	9	2020-04-19 00:19:49.176514	akshatshah21	u1	2
37	0	2020-04-19 00:19:49.566354	akshatshah21	u1	2
38	0	2020-04-19 00:19:49.708659	akshatshah21	u1	2
39	34	2020-04-19 00:19:50.451158	akshatshah21	u1	2
40	6532	2020-04-19 00:19:50.680121	akshatshah21	u1	2
41	6	2020-04-19 00:19:50.84075	akshatshah21	u1	2
42	457	2020-04-19 00:19:51.048243	akshatshah21	u1	2
43	65	2020-04-19 00:19:51.220664	akshatshah21	u1	2
44	856	2020-04-19 00:19:51.430684	akshatshah21	u1	2
45	854	2020-04-19 00:19:51.647613	akshatshah21	u1	2
46	68	2020-04-19 00:19:51.815868	akshatshah21	u1	2
47	56	2020-04-19 00:19:51.977993	akshatshah21	u1	2
48	8	2020-04-19 00:19:52.139011	akshatshah21	u1	2
49	3468	2020-04-19 00:19:52.310205	akshatshah21	u1	2
50	56	2020-04-19 00:19:52.495096	akshatshah21	u1	2
51	935	2020-04-19 00:19:52.684086	akshatshah21	u1	2
52	68	2020-04-19 00:19:53.634341	akshatshah21	u1	2
53	Lazy loading is not smooth....	2020-04-19 00:20:58.215783	u1	akshatshah21	2
54	M1	2020-04-20 22:58:05.577818	u1	u3	5
55	M2	2020-04-20 22:58:06.96157	u1	u3	5
56	M3	2020-04-20 22:58:07.736778	u1	u3	5
57	M4	2020-04-20 22:58:08.559466	u1	u3	5
58	M5	2020-04-20 22:58:10.088978	u1	u3	5
59	M6	2020-04-20 22:58:10.8676	u1	u3	5
60	M7	2020-04-20 22:58:11.734788	u1	u3	5
61	M8	2020-04-20 22:58:13.110439	u1	u3	5
62	M9	2020-04-20 22:58:14.17247	u1	u3	5
63	M10	2020-04-20 22:58:15.930879	u1	u3	5
64	M11	2020-04-20 22:58:16.990345	u1	u3	5
65	M12	2020-04-20 22:58:18.696043	u1	u3	5
66	M13	2020-04-20 22:58:19.68365	u1	u3	5
67	M14	2020-04-20 22:58:20.639864	u1	u3	5
68	M15	2020-04-20 22:58:21.736225	u1	u3	5
69	M16	2020-04-20 22:58:23.456356	u1	u3	5
70	M17	2020-04-20 22:58:24.616651	u1	u3	5
71	M18	2020-04-20 22:58:26.006876	u1	u3	5
72	M19	2020-04-20 22:58:27.577169	u1	u3	5
73	M20	2020-04-20 22:58:28.953086	u1	u3	5
74	Hi!	2020-04-21 17:56:06.344652	rpioli4	u2	6
75	Hey Roderigo!	2020-04-21 17:56:41.500809	u2	rpioli4	6
\.


--
-- Data for Name: pending_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pending_requests (user_id, community_id) FROM stdin;
\.


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post (post_id, title, content, time_of_creation, upvotes, downvotes, author_id, subforum_id, community_id) FROM stdin;
2	File Organization in Database Management Systems	<p>A database consists of a huge amount of data. The data is grouped within a table in RDBMS, and each table have related records. A user can see that the data is stored in form of tables, but in acutal this huge amount of data is stored in physical memory in form of files.</p>\r\n<p><strong>File &ndash;</strong> A file is named collection of related information that is recorded on secondary storage such as magnetic disks, magnetic tables and optical disks.</p>\r\n<p><strong>What is File Organization?</strong><br />File Organization refers to the logical relationships among various records that constitute the file, particularly with respect to the means of identification and access to any specific record. In simple terms, Storing the files in certain order is called file Organization. <strong>File Structure</strong> refers to the format of the label and data blocks and of any logical control record.</p>\r\n<p>&nbsp;</p>\r\n<div id="AP_G4GR_5">\r\n<div id="c9541d0b-2b1f-47f8-8b8b-63e4e11f2de9" class="_ap_apex_ad" style="display: block; clear: both; text-align: center; margin: 10px auto;" data-section="c9541d0b-2b1f-47f8-8b8b-63e4e11f2de9" data-xpath="#AP_G4GR_5" data-section-id="" data-render-time="1587459984734" data-refresh-time="1587459984735" data-timeout="18">\r\n<div id="ADP_40792_728X280_c9541d0b-2b1f-47f8-8b8b-63e4e11f2de9" style="text-align: center; margin: 0 auto;" data-google-query-id="CKaS46WV-egCFRsXtwAdeYkDQw">&nbsp;</div>\r\n</div>\r\n</div>\r\n<p>&nbsp;</p>\r\n<h3>Types of File Organizations &ndash;</h3>\r\n<p>Various methods have been introduced to Organize files. These particular methods have advantages and disadvantages on the basis of access or selection . Thus it is all upon the programmer to decide the best suited file Organization method according to his requirements.<br />Some types of File Organizations are :</p>\r\n<ul>\r\n<li>Sequential File Organization</li>\r\n<li>Heap File Organization</li>\r\n<li>Hash File Organization</li>\r\n<li>B+ Tree File Organization</li>\r\n<li>Clustered File Organization</li>\r\n</ul>\r\n<p>We will be discussing each of the file Organizations in further sets of this article along with differences and advantages/ disadvantages of each file Organization methods.</p>\r\n<h3>Sequential File Organization &ndash;</h3>\r\n<p>The easiest method for file Organization is Sequential method. In this method the file are stored one after another in a sequential manner. There are two ways to implement this method:</p>\r\n<ol>\r\n<li><strong>Pile File Method &ndash;</strong> This method is quite simple, in which we store the records in a sequence i.e one after other in the order in which they are inserted into the tables.<br /><img style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/uploads/FileOrganization01.png" alt="" /><br /><strong>Insertion of new record &ndash;</strong><br />Let the R1, R3 and so on upto R5 and R4 be four records in the sequence. Here, records are nothing but a row in any table. Suppose a new record R2 has to be inserted in the sequence, then it is simply placed at the end of the file.<br /><img style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/uploads/FileOrganization00.png" alt="" /></li>\r\n<li><strong>Sorted File Method &ndash;</strong>In this method, As the name itself suggest whenever a new record has to be inserted, it is always inserted in a sorted (ascending or descending) manner. Sorting of records may be based on any primary key or any other key.<br /><img style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/uploads/FileOrganization66.png" alt="" />\r\n<p><strong>Insertion of new record &ndash;</strong><br />Let us assume that there is a preexisting sorted sequence of four records R1, R3, and so on upto R7 and R8. Suppose a new record R2 has to be inserted in the sequence, then it will be inserted at the end of the file and then it will sort the sequence .<br /><img style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/uploads/FileOrganization22.png" alt="" /></p>\r\n</li>\r\n</ol>\r\n<p><strong>Pros and Cons of Sequential File Organization &ndash;</strong><br /><strong>Pros &ndash;</strong></p>\r\n<ul>\r\n<li>Fast and efficient method for huge amount of data.</li>\r\n<li>Simple design.</li>\r\n<li>Files can be easily stored in magnetic tapes i.e cheaper storage mechanism.</li>\r\n</ul>\r\n<p><strong>Cons &ndash;</strong></p>\r\n<ul>\r\n<li>Time wastage as we cannot jump on a particular record that is required, but we have to move in a sequential manner which takes our time.</li>\r\n<li>Sorted file method is inefficient as it takes time and space for sorting records.</li>\r\n</ul>\r\n<h3>Heap File Organization &ndash;</h3>\r\n<p>Heap File Organization works with data blocks. In this method records are inserted at the end of the file, into the data blocks. No Sorting or Ordering is required in this method. If a data block is full, the new record is stored in some other block, Here the other data block need not be the very next data block, but it can be any block in the memory. It is the responsibility of DBMS to store and manage the new records.<br /><img style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/uploads/FileOrganization33.png" alt="" /><br /><strong>Insertion of new record &ndash;</strong><br />Suppose we have four records in the heap R1, R5, R6, R4 and R3 and suppose a new record R2 has to be inserted in the heap then, since the last data block i.e data block 3 is full it will be inserted in any of the data blocks selected by the DBMS, lets say data block 1.</p>\r\n<p><img style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/uploads/FileOrganization44.png" alt="" /></p>\r\n<p>If we want to search, delete or update data in heap file Organization the we will traverse the data from the beginning of the file till we get the requested record. Thus if the database is very huge, searching, deleting or updating the record will take a lot of time.</p>\r\n<p><strong>Pros and Cons of Heap File Organization &ndash;</strong><br /><strong>Pros &ndash;</strong></p>\r\n<ul>\r\n<li>Fetching and retrieving records is faster than sequential record but only in case of small databases.</li>\r\n<li>When there is a huge number of data needs to be loaded into the database at a time, then this method of file Organization is best suited.</li>\r\n</ul>\r\n<p><strong>Cons &ndash;</strong></p>\r\n<ul>\r\n<li>Problem of unused memory blocks.</li>\r\n<li>Inefficient for larger databases.</li>\r\n</ul>	2020-04-21 14:37:35.853565	22	17	1	\N	\N
3	An Introduction to SQL	<p style="text-align: center;">Structured Query Language is a standard Database language which is used to create, maintain and retrieve the relational database. Following are some interesting facts about SQL.</p>\r\n<ul>\r\n<ul>\r\n<li>SQL is case insensitive. But it is a recommended practice to use keywords (like SELECT, UPDATE, CREATE, etc) in capital letters and use user defined things (liked table name, column name, etc) in small letters.</li>\r\n<li>We can write comments in SQL using &ldquo;&ndash;&rdquo; (double hyphen) at the beginning of any line.</li>\r\n<li>SQL is the programming language for relational databases (explained below) like MySQL, Oracle, Sybase, SQL Server, Postgre, etc. Other non-relational databases (also called NoSQL) databases like MongoDB, DynamoDB, etc do not use SQL</li>\r\n<li>Although there is an ISO standard for SQL, most of the implementations slightly vary in syntax. So we may encounter queries that work in SQL Server but do not work in MySQL.</li>\r\n</ul>\r\n</ul>\r\n<p>.</p>\r\n<p><strong>What is Relational Database?</strong></p>\r\n<p>Relational database means the data is stored as well as retrieved in the form of relations (tables). Table 1 shows the relational database with only one relation called <strong>STUDENT</strong> which stores <strong>ROLL_NO</strong>, <strong>NAME</strong>, <strong>ADDRESS</strong>, <strong>PHONE</strong> and <strong>AGE</strong> of students.</p>\r\n<p>&nbsp;</p>\r\n<div id="AP_G4GR_5">\r\n<div id="c9541d0b-2b1f-47f8-8b8b-63e4e11f2de9" class="_ap_apex_ad" style="display: block; clear: both; text-align: center; margin: 10px auto;" data-section="c9541d0b-2b1f-47f8-8b8b-63e4e11f2de9" data-xpath="#AP_G4GR_5" data-section-id="" data-render-time="1587460249436" data-refresh-time="1587460253316" data-timeout="51">\r\n<div id="ADP_40792_728X280_c9541d0b-2b1f-47f8-8b8b-63e4e11f2de9" style="text-align: center; margin: 0 auto;" data-google-query-id="CNS62aOW-egCFcUXaAodu68Axw">&nbsp;</div>\r\n</div>\r\n</div>\r\n<p>&nbsp;</p>\r\n<p><strong>STUDENT</strong></p>\r\n<table style="border-collapse: collapse;" border="2">\r\n<tbody>\r\n<tr>\r\n<td style="background-color: #2dc26b;" width="97"><strong>ROLL_NO</strong></td>\r\n<td style="background-color: #2dc26b;" width="130"><strong>NAME</strong></td>\r\n<td style="background-color: #2dc26b;" width="135"><strong>ADDRESS</strong></td>\r\n<td style="background-color: #2dc26b;" width="135"><strong>PHONE</strong></td>\r\n<td style="background-color: #2dc26b;" width="68"><strong>AGE</strong></td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="97">1</td>\r\n<td style="text-align: center; background-color: #e67e23;" width="130">RAM</td>\r\n<td style="background-color: #e67e23;" width="135">DELHI</td>\r\n<td style="background-color: #e67e23;" width="135">9455123451</td>\r\n<td style="background-color: #e67e23;" width="68">18</td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="97">2</td>\r\n<td style="background-color: #e67e23;" width="130">RAMESH</td>\r\n<td style="background-color: #e67e23;" width="135">GURGAON</td>\r\n<td style="background-color: #e67e23;" width="135">9652431543</td>\r\n<td style="text-align: center; background-color: #e67e23;" width="68">18</td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="97">3</td>\r\n<td style="background-color: #e67e23;" width="130">SUJIT</td>\r\n<td style="background-color: #e67e23;" width="135">ROHTAK</td>\r\n<td style="background-color: #e67e23;" width="135">9156253131</td>\r\n<td style="background-color: #e67e23;" width="68">20</td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="97">4</td>\r\n<td style="background-color: #e67e23;" width="130">SURESH</td>\r\n<td style="background-color: #e67e23;" width="135">DELHI</td>\r\n<td style="background-color: #e67e23;" width="135">9156768971</td>\r\n<td style="background-color: #e67e23;" width="68">18</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p style="text-align: center;"><strong>&nbsp;</strong><strong>TABLE 1</strong></p>\r\n<p>These are some important terminologies that are used in terms of relation.</p>\r\n<p><strong>Attribute:</strong> Attributes are the properties that define a relation. e.g.; <strong>ROLL_NO</strong>, <strong>NAME</strong> etc.</p>\r\n<p><strong>Tuple:</strong> Each row in the relation is known as tuple. The above relation contains 4 tuples, one of which is shown as:</p>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="97">1</td>\r\n<td style="background-color: #e67e23;" width="130">RAM</td>\r\n<td style="background-color: #e67e23;" width="135">DELHI</td>\r\n<td style="background-color: #e67e23;" width="135">9455123451</td>\r\n<td style="background-color: #e67e23;" width="68">18</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p><strong>Degree:</strong> The number of attributes in the relation is known as degree of the relation. The <strong>STUDENT</strong> relation defined above has degree 5.</p>\r\n<p><strong>Cardinality: </strong>The number of tuples in a relation is known as cardinality. The <strong>STUDENT</strong> relation defined above has cardinality 4.</p>\r\n<p><strong>Column:</strong> Column represents the set of values for a particular attribute. The column <strong>ROLL_NO</strong> is extracted from relation STUDENT.</p>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td style="width: 97px; background-color: #2dc26b;" width="97"><strong>ROLL_NO</strong></td>\r\n</tr>\r\n<tr>\r\n<td style="width: 97px; background-color: #e67e23;" width="97">1</td>\r\n</tr>\r\n<tr>\r\n<td style="width: 97px; background-color: #e67e23;" width="97">2</td>\r\n</tr>\r\n<tr>\r\n<td style="width: 97px; background-color: #e67e23;" width="97">3</td>\r\n</tr>\r\n<tr>\r\n<td style="width: 97px; background-color: #e67e23;" width="97">4</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p>The queries to deal with relational database can be categories as:</p>\r\n<p><strong>Data Definition Language:</strong> It is used to define the structure of the database. e.g; CREATE TABLE, ADD COLUMN, DROP COLUMN and so on.</p>\r\n<p>&nbsp;</p>\r\n<div id="AP_G4GR_6">\r\n<div id="76621e0b-1fac-4840-ba08-8ec48d007bc6" class="_ap_apex_ad" style="display: block; clear: both; text-align: center; margin: 10px auto;" data-section="76621e0b-1fac-4840-ba08-8ec48d007bc6" data-xpath="#AP_G4GR_6:eq(0)" data-section-id="" data-render-time="1587460249450">\r\n<div id="ADP_40792_728X280_76621e0b-1fac-4840-ba08-8ec48d007bc6" style="text-align: center; margin: 0 auto;" data-google-query-id="CNW62aOW-egCFcUXaAodu68Axw">&nbsp;</div>\r\n</div>\r\n</div>\r\n<p>&nbsp;</p>\r\n<p><strong>Data Manipulation Language:</strong> It is used to manipulate data in the relations. e.g.; INSERT, DELETE, UPDATE and so on.</p>\r\n<p><strong>Data Query Language:</strong> It is used to extract the data from the relations. e.g.; SELECT</p>\r\n<p>So first we will consider the Data Query Language. A generic query to retrieve from a relational database is:</p>\r\n<ul>\r\n<ul>\r\n<ol>\r\n<li><strong>SELECT</strong> [<strong>DISTINCT</strong>] Attribute_List <strong>FROM</strong> R1,R2&hellip;.RM</li>\r\n<li>[<strong>WHERE</strong> condition]</li>\r\n<li>[<strong>GROUP BY</strong> (Attributes)[<strong>HAVING</strong> condition]]</li>\r\n<li>[<strong>ORDER BY</strong>(Attributes)[<strong>DESC</strong>]];</li>\r\n</ol>\r\n</ul>\r\n</ul>\r\n<p>Part of the query represented by statement 1 is compulsory if you want to retrieve from a relational database. The statements written inside [] are optional. We will look at the possible query combination on relation shown in Table 1.</p>\r\n<p><strong>Case 1:</strong> If we want to retrieve attributes <strong>ROLL_NO</strong> and <strong>NAME</strong> of all students, the query will be:</p>\r\n<pre><strong>SELECT</strong> ROLL_NO, NAME <strong>FROM</strong> STUDENT;</pre>\r\n<table style="border-collapse: collapse; background-color: #2dc26b; height: 100px;">\r\n<tbody>\r\n<tr style="height: 20px;">\r\n<td style="height: 20px; width: 134px;"><span style="background-color: #2dc26b;"><strong>ROLL_NO</strong></span></td>\r\n<td style="height: 20px; width: 130px;"><span style="background-color: #2dc26b;"><strong>NAME</strong></span></td>\r\n</tr>\r\n<tr style="height: 20px;">\r\n<td style="height: 20px; width: 134px; background-color: #e67e23;">1</td>\r\n<td style="height: 20px; width: 130px; background-color: #e67e23;">RAM</td>\r\n</tr>\r\n<tr style="height: 20px;">\r\n<td style="height: 20px; width: 134px; background-color: #e67e23;">2</td>\r\n<td style="height: 20px; width: 130px; background-color: #e67e23;">RAMESH</td>\r\n</tr>\r\n<tr style="height: 20px;">\r\n<td style="height: 20px; width: 134px; background-color: #e67e23;">3</td>\r\n<td style="height: 20px; width: 130px; background-color: #e67e23;">SUJIT</td>\r\n</tr>\r\n<tr style="height: 20px;">\r\n<td style="height: 20px; width: 134px; background-color: #e67e23;">4</td>\r\n<td style="height: 20px; width: 130px; background-color: #e67e23;">SURESH</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p><strong>Case 2:</strong> If we want to retrieve <strong>ROLL_NO</strong> and <strong>NAME</strong> of the students whose <strong>ROLL_NO</strong> is greater than 2, the query will be:</p>\r\n<pre><strong>SELECT</strong> ROLL_NO, NAME <strong>FROM</strong> STUDENT \r\n<strong>WHERE</strong> <strong>ROLL_NO</strong>&gt;2;</pre>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td style="background-color: #2dc26b;" width="134"><strong>ROLL_NO</strong></td>\r\n<td style="background-color: #2dc26b;" width="130"><strong>NAME</strong></td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="134">3</td>\r\n<td style="background-color: #e67e23;" width="130">SUJIT</td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="134">4</td>\r\n<td style="background-color: #e67e23;" width="130">SURESH</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p><strong>CASE 3:</strong> If we want to retrieve all attributes of students, we can write * in place of writing all attributes as:</p>\r\n<pre><strong>SELECT</strong> <strong>* FROM</strong> STUDENT <strong>\r\nWHERE</strong> ROLL_NO&gt;2;</pre>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td style="background-color: #2dc26b;" width="134"><strong>ROLL_NO</strong></td>\r\n<td style="background-color: #2dc26b;" width="130"><strong>NAME</strong></td>\r\n<td style="background-color: #2dc26b;" width="135"><strong>ADDRESS</strong></td>\r\n<td style="background-color: #2dc26b;" width="135"><strong>PHONE</strong></td>\r\n<td style="background-color: #2dc26b;" width="105"><strong>AGE</strong></td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="134">3</td>\r\n<td style="background-color: #e67e23;" width="130">SUJIT</td>\r\n<td style="background-color: #e67e23;" width="135">ROHTAK</td>\r\n<td style="background-color: #e67e23;" width="135">9156253131</td>\r\n<td style="background-color: #e67e23;" width="105">20</td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="134">4</td>\r\n<td style="background-color: #e67e23;" width="130">SURESH</td>\r\n<td style="background-color: #e67e23;" width="135">DELHI</td>\r\n<td style="background-color: #e67e23;" width="135">9156768971</td>\r\n<td style="background-color: #e67e23;" width="105">18</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p><strong>CASE 4:</strong> If we want to represent the relation in ascending order by <strong>AGE</strong>, we can use ORDER BY clause as:</p>\r\n<pre><strong>SELECT * FROM</strong> STUDENT <strong>ORDER BY</strong> AGE;</pre>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td style="background-color: #2dc26b;" width="134"><strong>ROLL_NO</strong></td>\r\n<td style="background-color: #2dc26b;" width="130"><strong>NAME</strong></td>\r\n<td style="background-color: #2dc26b;" width="135"><strong>ADDRESS</strong></td>\r\n<td style="background-color: #2dc26b;" width="135"><strong>PHONE</strong></td>\r\n<td style="background-color: #2dc26b;" width="105"><strong>AGE</strong></td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="134">1</td>\r\n<td style="background-color: #e67e23;" width="130">RAM</td>\r\n<td style="background-color: #e67e23;" width="135">DELHI</td>\r\n<td style="background-color: #e67e23;" width="135">9455123451</td>\r\n<td style="background-color: #e67e23;" width="105">18</td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="134">2</td>\r\n<td style="background-color: #e67e23;" width="130">RAMESH</td>\r\n<td style="background-color: #e67e23;" width="135">GURGAON</td>\r\n<td style="background-color: #e67e23;" width="135">9652431543</td>\r\n<td style="background-color: #e67e23;" width="105">18</td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="134">4</td>\r\n<td style="background-color: #e67e23;" width="130">SURESH</td>\r\n<td style="background-color: #e67e23;" width="135">DELHI</td>\r\n<td style="background-color: #e67e23;" width="135">9156768971</td>\r\n<td style="background-color: #e67e23;" width="105">18</td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="134">3</td>\r\n<td style="background-color: #e67e23;" width="130">SUJIT</td>\r\n<td style="background-color: #e67e23;" width="135">ROHTAK</td>\r\n<td style="background-color: #e67e23;" width="135">9156253131</td>\r\n<td style="background-color: #e67e23;" width="105">20</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p><strong>Note:</strong> ORDER BY <strong>AGE</strong> is equivalent to ORDER BY <strong>AGE</strong> ASC. If we want to retrieve the results in descending order of <strong>AGE</strong>, we can use ORDER BY <strong>AGE</strong> DESC.</p>\r\n<p><strong>CASE 5:</strong> If we want to retrieve distinct values of an attribute or group of attribute, DISTINCT is used as in:</p>\r\n<p><br /><br /></p>\r\n<pre><strong>SELECT DISTINCT</strong> ADDRESS <strong>FROM </strong>STUDENT;</pre>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td style="width: 135px; background-color: #2dc26b;" width="135"><strong>ADDRESS</strong></td>\r\n</tr>\r\n<tr>\r\n<td style="width: 135px; background-color: #e67e23;" width="135">DELHI</td>\r\n</tr>\r\n<tr>\r\n<td style="width: 135px; background-color: #e67e23;" width="135">GURGAON</td>\r\n</tr>\r\n<tr>\r\n<td style="width: 135px; background-color: #e67e23;" width="135">ROHTAK</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p>If DISTINCT is not used, DELHI will be repeated twice in result set. Before understanding GROUP BY and HAVING, we need to understand aggregations functions in SQL.</p>\r\n<p><strong>AGGRATION FUNCTIONS: </strong>Aggregation functions are used to perform mathematical operations on data values of a relation. Some of the common aggregation functions used in SQL are:</p>\r\n<ul>\r\n<ul>\r\n<ul>\r\n<li><strong>COUNT:</strong> Count function is used to count the number of rows in a relation. e.g;</li>\r\n</ul>\r\n</ul>\r\n</ul>\r\n<pre><strong>SELECT</strong> <strong>COUNT</strong> (PHONE) <strong>FROM</strong> STUDENT;</pre>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td style="width: 135px; background-color: #2dc26b; text-align: center;" width="135"><strong>COUNT(PHONE)</strong></td>\r\n</tr>\r\n<tr>\r\n<td style="width: 135px; background-color: #e67e23; text-align: center;" width="135">4</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<ul>\r\n<ul>\r\n<ul>\r\n<li><strong>SUM:</strong> SUM function is used to add the values of an attribute in a relation. e.g;</li>\r\n</ul>\r\n</ul>\r\n</ul>\r\n<p><strong>SELECT</strong> <strong>SUM</strong> (AGE) <strong>FROM</strong> STUDENT;</p>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td style="width: 135px; background-color: #2dc26b; text-align: center;" width="135"><strong>SUM(AGE)</strong></td>\r\n</tr>\r\n<tr>\r\n<td style="width: 135px; background-color: #e67e23; text-align: center;" width="135">74</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p>In the same way, MIN, MAX and AVG can be used.&nbsp; As we have seen above, all aggregation functions return only 1 row.</p>\r\n<p><strong>GROUP BY:</strong> Group by is used to group the tuples of a relation based on an attribute or group of attribute. It is always combined with aggregation function which is computed on group. e.g.;</p>\r\n<pre><strong>SELECT</strong> ADDRESS, <strong>SUM</strong>(AGE) <strong>FROM</strong> STUDENT\r\n<strong>GROUP BY</strong> (ADDRESS);</pre>\r\n<p>In this query, SUM(<strong>AGE</strong>) will be computed but not for entire table but for each address. i.e.; sum of AGE for address DELHI(18+18=36) and similarly for other address as well. The output is:</p>\r\n<table style="height: 80px;">\r\n<tbody>\r\n<tr style="height: 20px;">\r\n<td style="background-color: #2dc26b; height: 20px; width: 135px;"><strong>ADDRESS</strong></td>\r\n<td style="background-color: #2dc26b; height: 20px; width: 105px;"><strong>SUM(AGE)</strong></td>\r\n</tr>\r\n<tr style="height: 20px;">\r\n<td style="height: 20px; width: 135px; background-color: #e67e23;">DELHI</td>\r\n<td style="height: 20px; width: 105px; background-color: #e67e23;">36</td>\r\n</tr>\r\n<tr style="height: 20px;">\r\n<td style="height: 20px; width: 135px; background-color: #e67e23;">GURGAON</td>\r\n<td style="height: 20px; width: 105px; background-color: #e67e23;">18</td>\r\n</tr>\r\n<tr style="height: 20px;">\r\n<td style="height: 20px; width: 135px; background-color: #e67e23;">ROHTAK</td>\r\n<td style="height: 20px; width: 105px; background-color: #e67e23;">20</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p>If we try to execute the query given below, it will result in error because although we have computed SUM(AGE) for each address, there are more than 1 ROLL_NO for&nbsp; each address we have grouped. So it can&rsquo;t be displayed in result set. We need to use aggregate functions on columns after SELECT statement to make sense of the resulting set whenever we are using GROUP BY.</p>\r\n<pre><strong>SELECT</strong> ROLL_NO, ADDRESS, <strong>SUM</strong>(AGE) <strong>FROM</strong> STUDENT\r\n<strong>GROUP BY</strong> (ADDRESS); </pre>\r\n<p><strong>NOTE:</strong> An attribute which is not a part of GROUP BY clause can&rsquo;t be used for selection. Any attribute which is part of GROUP BY CLAUSE can be used for selection but it is not mandatory. But we could use attributes which are not a part of the GROUP BY clause in an aggregrate function.</p>\r\n<p>&nbsp;</p>\r\n<p>This post is taken from Geeksforgeeks only to act as test data for this application. The source can be found using this link:</p>\r\n<p><a href="https://www.geeksforgeeks.org/structured-query-language/" target="_blank" rel="noopener">Structured Query Language</a></p>	2020-04-21 14:50:58.622506	27	25	1	\N	\N
8	Welcome	<h2>Welcome to this community!</h2>	2020-04-28 17:21:22.338993	0	0	38	\N	2
6	An introduction to SQL	<div class="p-5">Structured Query Language is a standard Database language which is used to create, maintain and retrieve the relational database. Following are some interesting facts about SQL.\r\n<ul>\r\n<ul>\r\n<li>SQL is case insensitive. But it is a recommended practice to use keywords (like SELECT, UPDATE, CREATE, etc) in capital letters and use user defined things (liked table name, column name, etc) in small letters.</li>\r\n<li>We can write comments in SQL using &ldquo;&ndash;&rdquo; (double hyphen) at the beginning of any line.</li>\r\n<li>SQL is the programming language for relational databases (explained below) like MySQL, Oracle, Sybase, SQL Server, Postgre, etc. Other non-relational databases (also called NoSQL) databases like MongoDB, DynamoDB, etc do not use SQL</li>\r\n<li>Although there is an ISO standard for SQL, most of the implementations slightly vary in syntax. So we may encounter queries that work in SQL Server but do not work in MySQL.</li>\r\n</ul>\r\n</ul>\r\n<p><img style="display: block; margin-left: auto; margin-right: auto;" title="sql.jpeg" src="/uploads/postFiles/file-1588064126898.jpg" alt="" width="389" height="129" /></p>\r\n<p><strong>What is Relational Database?</strong></p>\r\n<p>Relational database means the data is stored as well as retrieved in the form of relations (tables). Table 1 shows the relational database with only one relation called <strong>STUDENT</strong> which stores <strong>ROLL_NO</strong>, <strong>NAME</strong>, <strong>ADDRESS</strong>, <strong>PHONE</strong> and <strong>AGE</strong> of students.</p>\r\n<p>&nbsp;</p>\r\n<div id="AP_G4GR_5">\r\n<div id="c9541d0b-2b1f-47f8-8b8b-63e4e11f2de9" class="_ap_apex_ad" style="display: block; clear: both; text-align: center; margin: 10px auto;" data-section="c9541d0b-2b1f-47f8-8b8b-63e4e11f2de9" data-xpath="#AP_G4GR_5" data-section-id="" data-render-time="1587460249436" data-refresh-time="1587460253316" data-timeout="51">\r\n<div id="ADP_40792_728X280_c9541d0b-2b1f-47f8-8b8b-63e4e11f2de9" style="text-align: center; margin: 0 auto;" data-google-query-id="CNS62aOW-egCFcUXaAodu68Axw">&nbsp;</div>\r\n</div>\r\n</div>\r\n<p>&nbsp;</p>\r\n<p><strong>STUDENT</strong></p>\r\n<table style="border-collapse: collapse;" border="2">\r\n<tbody>\r\n<tr>\r\n<td style="background-color: #2dc26b;" width="97"><strong>ROLL_NO</strong></td>\r\n<td style="background-color: #2dc26b;" width="130"><strong>NAME</strong></td>\r\n<td style="background-color: #2dc26b;" width="135"><strong>ADDRESS</strong></td>\r\n<td style="background-color: #2dc26b;" width="135"><strong>PHONE</strong></td>\r\n<td style="background-color: #2dc26b;" width="68"><strong>AGE</strong></td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="97">1</td>\r\n<td style="text-align: center; background-color: #e67e23;" width="130">RAM</td>\r\n<td style="background-color: #e67e23;" width="135">DELHI</td>\r\n<td style="background-color: #e67e23;" width="135">9455123451</td>\r\n<td style="background-color: #e67e23;" width="68">18</td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="97">2</td>\r\n<td style="background-color: #e67e23;" width="130">RAMESH</td>\r\n<td style="background-color: #e67e23;" width="135">GURGAON</td>\r\n<td style="background-color: #e67e23;" width="135">9652431543</td>\r\n<td style="text-align: center; background-color: #e67e23;" width="68">18</td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="97">3</td>\r\n<td style="background-color: #e67e23;" width="130">SUJIT</td>\r\n<td style="background-color: #e67e23;" width="135">ROHTAK</td>\r\n<td style="background-color: #e67e23;" width="135">9156253131</td>\r\n<td style="background-color: #e67e23;" width="68">20</td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="97">4</td>\r\n<td style="background-color: #e67e23;" width="130">SURESH</td>\r\n<td style="background-color: #e67e23;" width="135">DELHI</td>\r\n<td style="background-color: #e67e23;" width="135">9156768971</td>\r\n<td style="background-color: #e67e23;" width="68">18</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p style="text-align: center;"><strong>&nbsp;</strong><strong>TABLE 1</strong></p>\r\n<p>These are some important terminologies that are used in terms of relation.</p>\r\n<p><strong>Attribute:</strong> Attributes are the properties that define a relation. e.g.; <strong>ROLL_NO</strong>, <strong>NAME</strong> etc.</p>\r\n<p><strong>Tuple:</strong> Each row in the relation is known as tuple. The above relation contains 4 tuples, one of which is shown as:</p>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="97">1</td>\r\n<td style="background-color: #e67e23;" width="130">RAM</td>\r\n<td style="background-color: #e67e23;" width="135">DELHI</td>\r\n<td style="background-color: #e67e23;" width="135">9455123451</td>\r\n<td style="background-color: #e67e23;" width="68">18</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p><strong>Degree:</strong> The number of attributes in the relation is known as degree of the relation. The <strong>STUDENT</strong> relation defined above has degree 5.</p>\r\n<p><strong>Cardinality: </strong>The number of tuples in a relation is known as cardinality. The <strong>STUDENT</strong> relation defined above has cardinality 4.</p>\r\n<p><strong>Column:</strong> Column represents the set of values for a particular attribute. The column <strong>ROLL_NO</strong> is extracted from relation STUDENT.</p>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td style="width: 97px; background-color: #2dc26b;" width="97"><strong>ROLL_NO</strong></td>\r\n</tr>\r\n<tr>\r\n<td style="width: 97px; background-color: #e67e23;" width="97">1</td>\r\n</tr>\r\n<tr>\r\n<td style="width: 97px; background-color: #e67e23;" width="97">2</td>\r\n</tr>\r\n<tr>\r\n<td style="width: 97px; background-color: #e67e23;" width="97">3</td>\r\n</tr>\r\n<tr>\r\n<td style="width: 97px; background-color: #e67e23;" width="97">4</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p>The queries to deal with relational database can be categories as:</p>\r\n<p><strong>Data Definition Language:</strong> It is used to define the structure of the database. e.g; CREATE TABLE, ADD COLUMN, DROP COLUMN and so on.</p>\r\n<p>&nbsp;</p>\r\n<div id="AP_G4GR_6">\r\n<div id="76621e0b-1fac-4840-ba08-8ec48d007bc6" class="_ap_apex_ad" style="display: block; clear: both; text-align: center; margin: 10px auto;" data-section="76621e0b-1fac-4840-ba08-8ec48d007bc6" data-xpath="#AP_G4GR_6:eq(0)" data-section-id="" data-render-time="1587460249450">\r\n<div id="ADP_40792_728X280_76621e0b-1fac-4840-ba08-8ec48d007bc6" style="text-align: center; margin: 0 auto;" data-google-query-id="CNW62aOW-egCFcUXaAodu68Axw">&nbsp;</div>\r\n</div>\r\n</div>\r\n<p>&nbsp;</p>\r\n<p><strong>Data Manipulation Language:</strong> It is used to manipulate data in the relations. e.g.; INSERT, DELETE, UPDATE and so on.</p>\r\n<p><strong>Data Query Language:</strong> It is used to extract the data from the relations. e.g.; SELECT</p>\r\n<p>So first we will consider the Data Query Language. A generic query to retrieve from a relational database is:</p>\r\n<ul>\r\n<ul>\r\n<ol>\r\n<li><strong>SELECT</strong> [<strong>DISTINCT</strong>] Attribute_List <strong>FROM</strong> R1,R2&hellip;.RM</li>\r\n<li>[<strong>WHERE</strong> condition]</li>\r\n<li>[<strong>GROUP BY</strong> (Attributes)[<strong>HAVING</strong> condition]]</li>\r\n<li>[<strong>ORDER BY</strong>(Attributes)[<strong>DESC</strong>]];</li>\r\n</ol>\r\n</ul>\r\n</ul>\r\n<p>Part of the query represented by statement 1 is compulsory if you want to retrieve from a relational database. The statements written inside [] are optional. We will look at the possible query combination on relation shown in Table 1.</p>\r\n<p><strong>Case 1:</strong> If we want to retrieve attributes <strong>ROLL_NO</strong> and <strong>NAME</strong> of all students, the query will be:</p>\r\n<pre><strong>SELECT</strong> ROLL_NO, NAME <strong>FROM</strong> STUDENT;</pre>\r\n<table style="border-collapse: collapse; background-color: #2dc26b; height: 100px;">\r\n<tbody>\r\n<tr style="height: 20px;">\r\n<td style="height: 20px; width: 134px;"><span style="background-color: #2dc26b;"><strong>ROLL_NO</strong></span></td>\r\n<td style="height: 20px; width: 130px;"><span style="background-color: #2dc26b;"><strong>NAME</strong></span></td>\r\n</tr>\r\n<tr style="height: 20px;">\r\n<td style="height: 20px; width: 134px; background-color: #e67e23;">1</td>\r\n<td style="height: 20px; width: 130px; background-color: #e67e23;">RAM</td>\r\n</tr>\r\n<tr style="height: 20px;">\r\n<td style="height: 20px; width: 134px; background-color: #e67e23;">2</td>\r\n<td style="height: 20px; width: 130px; background-color: #e67e23;">RAMESH</td>\r\n</tr>\r\n<tr style="height: 20px;">\r\n<td style="height: 20px; width: 134px; background-color: #e67e23;">3</td>\r\n<td style="height: 20px; width: 130px; background-color: #e67e23;">SUJIT</td>\r\n</tr>\r\n<tr style="height: 20px;">\r\n<td style="height: 20px; width: 134px; background-color: #e67e23;">4</td>\r\n<td style="height: 20px; width: 130px; background-color: #e67e23;">SURESH</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p><strong>Case 2:</strong> If we want to retrieve <strong>ROLL_NO</strong> and <strong>NAME</strong> of the students whose <strong>ROLL_NO</strong> is greater than 2, the query will be:</p>\r\n<pre><strong>SELECT</strong> ROLL_NO, NAME <strong>FROM</strong> STUDENT \r\n<strong>WHERE</strong> <strong>ROLL_NO</strong>&gt;2;</pre>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td style="background-color: #2dc26b;" width="134"><strong>ROLL_NO</strong></td>\r\n<td style="background-color: #2dc26b;" width="130"><strong>NAME</strong></td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="134">3</td>\r\n<td style="background-color: #e67e23;" width="130">SUJIT</td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="134">4</td>\r\n<td style="background-color: #e67e23;" width="130">SURESH</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p><strong>CASE 3:</strong> If we want to retrieve all attributes of students, we can write * in place of writing all attributes as:</p>\r\n<pre><strong>SELECT</strong> <strong>* FROM</strong> STUDENT <strong>\r\nWHERE</strong> ROLL_NO&gt;2;</pre>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td style="background-color: #2dc26b;" width="134"><strong>ROLL_NO</strong></td>\r\n<td style="background-color: #2dc26b;" width="130"><strong>NAME</strong></td>\r\n<td style="background-color: #2dc26b;" width="135"><strong>ADDRESS</strong></td>\r\n<td style="background-color: #2dc26b;" width="135"><strong>PHONE</strong></td>\r\n<td style="background-color: #2dc26b;" width="105"><strong>AGE</strong></td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="134">3</td>\r\n<td style="background-color: #e67e23;" width="130">SUJIT</td>\r\n<td style="background-color: #e67e23;" width="135">ROHTAK</td>\r\n<td style="background-color: #e67e23;" width="135">9156253131</td>\r\n<td style="background-color: #e67e23;" width="105">20</td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="134">4</td>\r\n<td style="background-color: #e67e23;" width="130">SURESH</td>\r\n<td style="background-color: #e67e23;" width="135">DELHI</td>\r\n<td style="background-color: #e67e23;" width="135">9156768971</td>\r\n<td style="background-color: #e67e23;" width="105">18</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p><strong>CASE 4:</strong> If we want to represent the relation in ascending order by <strong>AGE</strong>, we can use ORDER BY clause as:</p>\r\n<pre><strong>SELECT * FROM</strong> STUDENT <strong>ORDER BY</strong> AGE;</pre>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td style="background-color: #2dc26b;" width="134"><strong>ROLL_NO</strong></td>\r\n<td style="background-color: #2dc26b;" width="130"><strong>NAME</strong></td>\r\n<td style="background-color: #2dc26b;" width="135"><strong>ADDRESS</strong></td>\r\n<td style="background-color: #2dc26b;" width="135"><strong>PHONE</strong></td>\r\n<td style="background-color: #2dc26b;" width="105"><strong>AGE</strong></td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="134">1</td>\r\n<td style="background-color: #e67e23;" width="130">RAM</td>\r\n<td style="background-color: #e67e23;" width="135">DELHI</td>\r\n<td style="background-color: #e67e23;" width="135">9455123451</td>\r\n<td style="background-color: #e67e23;" width="105">18</td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="134">2</td>\r\n<td style="background-color: #e67e23;" width="130">RAMESH</td>\r\n<td style="background-color: #e67e23;" width="135">GURGAON</td>\r\n<td style="background-color: #e67e23;" width="135">9652431543</td>\r\n<td style="background-color: #e67e23;" width="105">18</td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="134">4</td>\r\n<td style="background-color: #e67e23;" width="130">SURESH</td>\r\n<td style="background-color: #e67e23;" width="135">DELHI</td>\r\n<td style="background-color: #e67e23;" width="135">9156768971</td>\r\n<td style="background-color: #e67e23;" width="105">18</td>\r\n</tr>\r\n<tr>\r\n<td style="background-color: #e67e23;" width="134">3</td>\r\n<td style="background-color: #e67e23;" width="130">SUJIT</td>\r\n<td style="background-color: #e67e23;" width="135">ROHTAK</td>\r\n<td style="background-color: #e67e23;" width="135">9156253131</td>\r\n<td style="background-color: #e67e23;" width="105">20</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p><strong>Note:</strong> ORDER BY <strong>AGE</strong> is equivalent to ORDER BY <strong>AGE</strong> ASC. If we want to retrieve the results in descending order of <strong>AGE</strong>, we can use ORDER BY <strong>AGE</strong> DESC.</p>\r\n<p><strong>CASE 5:</strong> If we want to retrieve distinct values of an attribute or group of attribute, DISTINCT is used as in:</p>\r\n<p><br /><br /></p>\r\n<pre><strong>SELECT DISTINCT</strong> ADDRESS <strong>FROM </strong>STUDENT;</pre>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td style="width: 135px; background-color: #2dc26b;" width="135"><strong>ADDRESS</strong></td>\r\n</tr>\r\n<tr>\r\n<td style="width: 135px; background-color: #e67e23;" width="135">DELHI</td>\r\n</tr>\r\n<tr>\r\n<td style="width: 135px; background-color: #e67e23;" width="135">GURGAON</td>\r\n</tr>\r\n<tr>\r\n<td style="width: 135px; background-color: #e67e23;" width="135">ROHTAK</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p>If DISTINCT is not used, DELHI will be repeated twice in result set. Before understanding GROUP BY and HAVING, we need to understand aggregations functions in SQL.</p>\r\n<p><strong>AGGRATION FUNCTIONS: </strong>Aggregation functions are used to perform mathematical operations on data values of a relation. Some of the common aggregation functions used in SQL are:</p>\r\n<ul>\r\n<ul>\r\n<ul>\r\n<li><strong>COUNT:</strong> Count function is used to count the number of rows in a relation. e.g;</li>\r\n</ul>\r\n</ul>\r\n</ul>\r\n<pre><strong>SELECT</strong> <strong>COUNT</strong> (PHONE) <strong>FROM</strong> STUDENT;</pre>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td style="width: 135px; background-color: #2dc26b; text-align: center;" width="135"><strong>COUNT(PHONE)</strong></td>\r\n</tr>\r\n<tr>\r\n<td style="width: 135px; background-color: #e67e23; text-align: center;" width="135">4</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<ul>\r\n<ul>\r\n<ul>\r\n<li><strong>SUM:</strong> SUM function is used to add the values of an attribute in a relation. e.g;</li>\r\n</ul>\r\n</ul>\r\n</ul>\r\n<p><strong>SELECT</strong> <strong>SUM</strong> (AGE) <strong>FROM</strong> STUDENT;</p>\r\n<table>\r\n<tbody>\r\n<tr>\r\n<td style="width: 135px; background-color: #2dc26b; text-align: center;" width="135"><strong>SUM(AGE)</strong></td>\r\n</tr>\r\n<tr>\r\n<td style="width: 135px; background-color: #e67e23; text-align: center;" width="135">74</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p>In the same way, MIN, MAX and AVG can be used.&nbsp; As we have seen above, all aggregation functions return only 1 row.</p>\r\n<p><strong>GROUP BY:</strong> Group by is used to group the tuples of a relation based on an attribute or group of attribute. It is always combined with aggregation function which is computed on group. e.g.;</p>\r\n<pre><strong>SELECT</strong> ADDRESS, <strong>SUM</strong>(AGE) <strong>FROM</strong> STUDENT\r\n<strong>GROUP BY</strong> (ADDRESS);</pre>\r\n<p>In this query, SUM(<strong>AGE</strong>) will be computed but not for entire table but for each address. i.e.; sum of AGE for address DELHI(18+18=36) and similarly for other address as well. The output is:</p>\r\n<table style="height: 80px;">\r\n<tbody>\r\n<tr style="height: 20px;">\r\n<td style="background-color: #2dc26b; height: 20px; width: 135px;"><strong>ADDRESS</strong></td>\r\n<td style="background-color: #2dc26b; height: 20px; width: 105px;"><strong>SUM(AGE)</strong></td>\r\n</tr>\r\n<tr style="height: 20px;">\r\n<td style="height: 20px; width: 135px; background-color: #e67e23;">DELHI</td>\r\n<td style="height: 20px; width: 105px; background-color: #e67e23;">36</td>\r\n</tr>\r\n<tr style="height: 20px;">\r\n<td style="height: 20px; width: 135px; background-color: #e67e23;">GURGAON</td>\r\n<td style="height: 20px; width: 105px; background-color: #e67e23;">18</td>\r\n</tr>\r\n<tr style="height: 20px;">\r\n<td style="height: 20px; width: 135px; background-color: #e67e23;">ROHTAK</td>\r\n<td style="height: 20px; width: 105px; background-color: #e67e23;">20</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p>If we try to execute the query given below, it will result in error because although we have computed SUM(AGE) for each address, there are more than 1 ROLL_NO for&nbsp; each address we have grouped. So it can&rsquo;t be displayed in result set. We need to use aggregate functions on columns after SELECT statement to make sense of the resulting set whenever we are using GROUP BY.</p>\r\n<pre><strong>SELECT</strong> ROLL_NO, ADDRESS, <strong>SUM</strong>(AGE) <strong>FROM</strong> STUDENT\r\n<strong>GROUP BY</strong> (ADDRESS); </pre>\r\n<p><strong>NOTE:</strong> An attribute which is not a part of GROUP BY clause can&rsquo;t be used for selection. Any attribute which is part of GROUP BY CLAUSE can be used for selection but it is not mandatory. But we could use attributes which are not a part of the GROUP BY clause in an aggregrate function.</p>\r\n<p>&nbsp;</p>\r\n<p>This post is taken from Geeksforgeeks only to act as test data for this application. The source can be found using this link:</p>\r\n<p><a href="https://www.geeksforgeeks.org/structured-query-language/" target="_blank" rel="noopener">Structured Query Language</a></p>\r\n</div>	2020-04-28 14:25:33.710991	2	0	38	3	\N
9	Bit manipulation	<div class="page-body">\r\n<h3 id="82db60b6-67f9-4874-a82b-2d474f1f96b0" class="">Finding out if a number is a power of 2:</h3>\r\n<ol id="25d7fbd5-45ec-40e2-8708-234673685649" class="numbered-list" start="1">\r\n<li>Naive approach is to keep dividing by 2 until we get 1 or 0. If 1, the number is a power of 2; if 0 then it's not. (special case: n=0; not a power of 2).</li>\r\n</ol>\r\n<ol id="60967f40-8dd2-4062-9a52-551550855560" class="numbered-list" start="2">\r\n<li>Now if a number is a power of 2, it has exactly one '1' in its binary representation, since it's binary!</li>\r\n</ol>\r\n<ol id="b6edd14f-dbc5-479d-8b9f-ae8558d183a9" class="numbered-list" start="3">\r\n<li>So now we need to check if there's exactly one '1' in binary representation of the number.</li>\r\n</ol>\r\n<ol id="8b26f55d-21a0-4d28-829b-4f380b244f69" class="numbered-list" start="4">\r\n<li>Consider the binary representation of a number, x. The binary representation of x-1 will be the same as x, from MSB to rightmost '1' (exclusive), and then inverted till LSB.</li>\r\n</ol>\r\n<ol id="0f4baaff-8dc7-41c1-866c-bc2425628e92" class="numbered-list" start="5">\r\n<li>Suppose we take binary AND of x and x-1, say y. So:\r\n<pre id="d4f4d949-8099-49e1-bc55-d7ef78b0389e" class="code"><code>y = x &amp; (x-1);</code></pre>\r\n</li>\r\n</ol>\r\n<ol id="7804c4a6-4a5a-430b-9bb9-fbb355144c7d" class="numbered-list" start="6">\r\n<li>Since the first partition of binary representation of x and x-1 is the same, y will have the same bits as x itself (work it out in your head!)</li>\r\n</ol>\r\n<ol id="3de81d15-5e51-4253-bb21-3e5749672d4c" class="numbered-list" start="7">\r\n<li>Now for the second partition, it has to be all zeroes, since those bits of x are inverted in x-1</li>\r\n</ol>\r\n<ol id="38867203-7312-4753-9f3f-5c19372860a2" class="numbered-list" start="8">\r\n<li>Now, if the number x is a power of 2, then the <em>rightmost '1' </em>of x is in fact its only 1.</li>\r\n</ol>\r\n<ol id="f6f85a44-f603-4909-8d19-c3e8f59966f8" class="numbered-list" start="9">\r\n<li>So now, if x is a power of 2, y must be 0.</li>\r\n</ol>\r\n<ol id="5d4ae6dd-661b-4514-bd65-e677059bab7f" class="numbered-list" start="10">\r\n<li>And that's our test!</li>\r\n</ol>\r\n<pre id="4ed007c7-c6e9-4189-81d3-9bba9612bc52" class="code"><code>bool isPowerOf2(int x) {\r\n\treturn x &amp;&amp; !(x &amp; x-1);\r\n}</code></pre>\r\n<p id="503dafcf-98cb-4a98-84bd-9bd792471bbc" class="">10. Caution! Check if it's already 0!</p>\r\n<h3 id="9e5ebe66-40f0-4940-8dd6-b573b304d256" class="">Finding out how many '1's are there in the binary form of a number:</h3>\r\n<ol id="cb8f343d-2e1f-4507-bdb1-7b2835454775" class="numbered-list" start="1">\r\n<li>Basic approach is to traverse that binary from and count 1's. Keep dividing by 2 and check LSB (either by bitwise AND with 1 or <code>%</code>). This approach has O(lgN) complexity.</li>\r\n</ol>\r\n<ol id="812f6245-5c61-423f-b931-bf5dcbe97628" class="numbered-list" start="2">\r\n<li>A better approach uses the same property of x and x-1 as '<a href="https://www.notion.so/Bit-manipulation-9b063d0f705947a0bae89688e440d082#82db60b667f94874a82b2d474f1f96b0">In Finding out if a number is a power of 2</a>'.</li>\r\n</ol>\r\n<ol id="83e01a68-5990-4cd4-9a09-7fa014dd48da" class="numbered-list" start="3">\r\n<li>If we bitwise AND x and x-1, then the rightmost 1 and the bits that follow it will be inverted and the ones before the rightmost bit will stay the same. Say we do this again, on the resultant number. Hence, we are actually going through every <em>rightmost '1'</em> one by one, and ignoring all zeroes in between.</li>\r\n</ol>\r\n<ol id="7c858e33-02c2-4061-a46a-34101986dd30" class="numbered-list" start="4">\r\n<li>So we can just set up a simple counter to count the number of iterations we perform. When do we stop? After every iteration, the <em>rightmost '1' becomes 0.</em> So when all '1's are depleted, the number will be zero. That's the condition to stop the loop!</li>\r\n</ol>\r\n<pre id="17ae7bca-618d-49a8-b8f8-4f2956352f55" class="code"><code>int countOnes(int x) { \r\n\tint count = 0;\r\n\twhile (x) {\r\n\t\tx = x &amp; (x-1); // or x &amp;= (x-1) if you like\r\n\t\tcount++;\r\n\t}\r\n\treturn count;\r\n}</code></pre>\r\n<p id="4cdaa70f-c63d-4094-8f80-6a826647a4b3" class="">5. The time complexity of this approach is better than the naive approach since the code inside the loop is executed only those many times as there are '1's. In the worst case, the number is 11111...111, so the loop executes lg(x) times.</p>\r\n<h3 id="8c1ae3ed-193a-458e-ae32-1f57798fe67c" class="">Check if i'th bit of a number is set :</h3>\r\n<ol id="5346fbcd-b1a0-43c8-8d8a-35c1c60267b4" class="numbered-list" start="1">\r\n<li>This one's easy! To check if a random bit is 1 set ('1') or not ('0'), we simply AND it with '1'. So if it is '1', we get output '1'; if it is '0', we get '0'.</li>\r\n</ol>\r\n<ol id="3a0de9c3-6928-4771-9539-22d449ee82c7" class="numbered-list" start="2">\r\n<li>The same concept can be applied here; we just have to take care of its position. We can do that using the left shift operator (&lt;&lt;).</li>\r\n</ol>\r\n<ol id="1ff92795-ed78-4cc0-8194-07999dc59e0c" class="numbered-list" start="3">\r\n<li>We start with 1 (000..1) and shift that '1' bit by i positions (i.e. to 2^i weight). Then we bitwise AND it with the given number.</li>\r\n</ol>\r\n<pre id="d64f40d9-1cd7-4c4f-a6cd-dfce53727ccc" class="code"><code>bool checkbit(int n, int i) {\r\n\treturn n &amp; (1 &lt;&lt; i); // implicit conversion to bool\r\n}</code></pre>\r\n<p id="32d07c0e-559d-4359-a295-ecc1ac19129c" class="">Note: To calculate a power of 2, simply do <code>1 &lt;&lt; exp</code> !</p>\r\n<h3 id="711d805c-7d37-4e21-9303-ad8c68bf2dcd" class="">Generate all possible subsets of a set:</h3>\r\n<ol id="d40fa0cc-131f-4229-a340-e5c1667a7a02" class="numbered-list" start="1">\r\n<li>In a set consisting of N elements, there are 2^N possible subsets (improper subsets). If we associate every bit of an N-bit binary string with an element, then we get a way to represent all the subsets easily. If the bit of the binary string representation of a subset corresponding to an element is 1, the element belongs to that subset; if it is 0, it does not. Hence each of the 2^N possible binary strings represents a unique subset (a one-to-one mapping!)</li>\r\n</ol>\r\n<pre id="ccf25145-69cf-4d38-884f-1bc85c03e98b" class="code"><code>void possibleSubsets(char A[], int n) {\r\n\tfor(int i=0; i&lt;(1 &lt;&lt; n); i++) {\r\n\t\tfor(int j=0; j&lt;n; j++) {\r\n\t\t\tif(checkbit(i, j)) // if j'th bit is set in i, equivalently: if(i &amp; (1 &lt;&lt; j))\r\n\t\t\t\tcout &lt;&lt; A[j] &lt;&lt; ' ';\r\n\t\t}\r\n\t\tcout &lt;&lt; endl; // one subset over\r\n\t}\r\n}</code></pre>\r\n<p id="030dc9ff-32e9-45f7-b7bb-83479d9a745b" class="">&nbsp;</p>\r\n<h3 id="42a4a4ab-73aa-427a-b27d-a484e4436e72" class="">Find greatest power of 2 less than or equal to the given number:</h3>\r\n<ol id="c878078a-c704-4110-bd06-92ea1482c782" class="numbered-list" start="1">\r\n<li>So we basically need to find the most significant bit which is 1, and 2^(that position) is the answer.</li>\r\n</ol>\r\n<ol id="23c8e61d-46d2-4507-9a5b-8881e92fd421" class="numbered-list" start="2">\r\n<li>A basic approach is to maintain a count, keep checking LSB and right shifting by 1 position. If LSB is 1, replace current answer with <code>1 &lt;&lt; count</code> (2 to the power of count), and stop when 0.</li>\r\n</ol>\r\n<ol id="9fd37218-4b2d-4d7a-8cc6-7d44b64128b9" class="numbered-list" start="3">\r\n<li>A better approach uses the following concept (not a very obvious approach): Say you have a number n. The MSB of n is such that its weight is x (which is in fact, the answer; we need to find x). So a number having only that bit set has value x. If we set all bits on the right of the MSB of binary form of x , we will get 2x-1 (work it out). E.g. if x = 8, then after setting all bits on the right of MSB, we get 15, which is 2*8 - 1.</li>\r\n</ol>\r\n<ol id="1d786ac8-3338-4ea0-85fd-a8bd83f237d8" class="numbered-list" start="4">\r\n<li>So we can find the value x of any number by setting all bits right to its MSB to 1, and then if the resulting number is y, <code>x = (y+1) / 2</code>. (Or <code>(y+1) &gt;&gt; 1</code> :-P)</li>\r\n</ol>\r\n<ol id="3ecfe765-9047-4bc5-989a-7efa2487b0fa" class="numbered-list" start="5">\r\n<li>Now the question is how do we set all bits right of MSB to 1? We use bitwise OR and right shift!</li>\r\n</ol>\r\n<figure id="b8bbfcdf-a64e-486a-98c6-4a8e57e81ad8" class="image"><a href="https://he-s3.s3.amazonaws.com/media/uploads/3fb910b.jpg"><img src="https://he-s3.s3.amazonaws.com/media/uploads/3fb910b.jpg" /></a></figure>\r\n<figure id="d542456d-28a9-45ca-a8ec-15c0bd314b48" class="image"><a href="https://he-s3.s3.amazonaws.com/media/uploads/4682f09.jpg"><img src="https://he-s3.s3.amazonaws.com/media/uploads/4682f09.jpg" /></a></figure>\r\n<figure id="d2a5dc6c-53a2-4f7b-bee6-1c9e556d89f5" class="image"><a href="https://he-s3.s3.amazonaws.com/media/uploads/53261d4.jpg"><img src="https://he-s3.s3.amazonaws.com/media/uploads/53261d4.jpg" /></a></figure>\r\n<figure id="e028b626-c2fb-40a8-86fc-9630cdcdf21b" class="image"><a href="https://he-s3.s3.amazonaws.com/media/uploads/5f05f51.jpg"><img src="https://he-s3.s3.amazonaws.com/media/uploads/5f05f51.jpg" /></a></figure>\r\n<p id="869ea83f-21e9-4fef-8e9c-b878711b9b6a" class="">Source: HackerEarth (<a href="https://www.hackerearth.com/practice/basic-programming/bit-manipulation/basics-of-bit-manipulation/tutorial/">https://www.hackerearth.com/practice/basic-programming/bit-manipulation/basics-of-bit-manipulation/tutorial/</a>)</p>\r\n<p id="a801b63b-35f9-4323-aee3-433cd8956c0d" class="">6. Since <code>int</code> is usually 4 bytes, it is sufficient to iterate till &gt;&gt;16. Then we simply use <code>x = (y+1) &gt;&gt; 1</code></p>\r\n<pre id="c921e717-c9e3-4b7b-b83f-558583b109d5" class="code"><code>int MaxPowerOf2Below(int y) {\r\n\tfor(int i=0;i&lt;5;i++)\r\n\t\ty = y | y &lt;&lt; (1&lt;&lt;i);\r\n\treturn (y+1) &gt;&gt; 1; \r\n}</code></pre>\r\n<h3 id="d066b131-353c-454c-8629-dbcf3872cb8b" class="">Getting the value represented by rightmost '1' of a number:</h3>\r\n<ol id="19e825ee-1866-499d-a5e7-e4c214762447" class="numbered-list" start="1">\r\n<li>Again, we use the property of (x-1). As we know, if we have a number x, in x-1, the bits starting from rightmost '1' are inverted, and the other bits stay the same.</li>\r\n</ol>\r\n<ol id="69ad175c-6f5d-4c57-a304-ad88cb9491c8" class="numbered-list" start="2">\r\n<li>If we do bitwise AND of x and x-1, the bits before (on the left of) the rightmost '1' in x stay the same as those in x, and the bits starting from rightmost '1' of x become 0. Let this resulting number be y. Let's also call <em>the rightmost '1' position</em> as just <em>the position</em>.</li>\r\n</ol>\r\n<ol id="99bfe84c-7041-4b59-9f97-90451b5fc976" class="numbered-list" start="3">\r\n<li>If we bitwise XOR x and y, then all the bits before<em> the position</em> will become 0 (since they were the same), and the bits after <em>the position</em> will also become 0, since those bits of y are zero, as explained in 2, and the corresponding bits of x are also zero, since our '<em>the position</em>' is the <em>rightmost </em>'1'. So the only bit remaining is at <em>the position</em>. This bit is '1' in x. Since it is 0 (inverted, see 1) in y, the output of XOR of these two will be 1. So we have a binary number in which only that bit is set which is at the position of the rightmost '1' in x. Alas, that is the answer. (Note: Take care with XOR operator and precedence. To be on the safe side, use brackets).</li>\r\n</ol>\r\n<pre id="8add4915-5ae0-4a12-bc12-ef1d8d2b1fdc" class="code"><code>int getTHATvalue(int x) {\r\n\treturn x ^ (x &amp; (x-1));\r\n}</code></pre>\r\n<p id="ed70bc51-09e3-49f0-8123-09522b0d097d" class=""><strong>Another method:</strong></p>\r\n<ol id="8fccc18f-d2c2-4c66-a751-cf291b94d614" class="numbered-list" start="1">\r\n<li>Let the number be x. -x will be represented as 2's complement of x (invert all bits, add 1)</li>\r\n</ol>\r\n<ol id="5983e7f3-b165-4774-af6e-1293de6f6210" class="numbered-list" start="2">\r\n<li>If you work it out, you'll notice that in -x, all the bits left of the <em>rightmost '1'</em> of x will be inverted. Since 1 was added after inversion, all bits right to the <em>rightmost '1'</em> will be 0. The rightmost '1' will stay 1.</li>\r\n</ol>\r\n<ol id="57c9f2d0-7955-4702-9995-e98052d9f3dd" class="numbered-list" start="3">\r\n<li>So if we bitwise AND x and -x, the left bits will become 0 (as all are inverted in -x), the bits to the right of rightmost 1 will also become 0 since they are all 0 in -x. The only bit position where the bit is set in x and -x is the rightmost '1'. And the value of this binary number is the answer.</li>\r\n</ol>\r\n<pre id="52426f09-2a98-4698-b734-dfa221fdf10e" class="code"><code>int getTHATvalue(int x) {\r\n\treturn x &amp; -x; // unary minus operator\r\n}</code></pre>\r\n<h3 id="22aa55d0-6d72-428f-bfbd-edf0ae681b47" class="">Setting n'th bit:</h3>\r\n<ol id="ae20c43c-c550-401c-bde8-33ce4b1e1154" class="numbered-list" start="1">\r\n<li>This one's simple! Basic intuition: OR that bit with 1</li>\r\n</ol>\r\n<ol id="98004088-2bd3-40ef-bdfe-f859c647d999" class="numbered-list" start="2">\r\n<li>So we use bitwise OR, and OR the input number with 1 shifted left n times.</li>\r\n</ol>\r\n<pre id="a034bf1f-c70c-435d-83e1-71ecbacfe291" class="code"><code>int setNthBit(int x, int n) {\r\n\treturn x | (1 &lt;&lt; n);\r\n}</code></pre>\r\n</div>	2020-04-28 18:41:18.153958	0	0	39	7	\N
10	Carousel: A Codeforces problem	<header></header>\r\n<div class="page-body">\r\n<h3 id="fbaac72d-86e2-4280-a74f-90f4e1aa8800" class="">Problem statement, simplified</h3>\r\n<p id="975889ce-c4e5-4458-8af6-afa3cfb66e53" class="">Given <em>n</em> numbers, (consider them to be a circular list), assign numbers to them in such a way that if two adjacent elements are distinct, they must have different numbers assigned to them. Also, minimize the total number (<em>k</em>) of distinct numbers which are assigned to the elements.</p>\r\n<h3 id="c7256053-2d5b-4fcd-adec-0a831d491e5c" class="">Constraints</h3>\r\n<p id="f746b2f8-a5b6-4c18-b841-624796bbe305" class="">1 &le; t &le; 10^4</p>\r\n<p id="f879fac2-1984-4ef5-bd0f-3cfcbdc05a8f" class="">3 &le; n &le; 2 * 10^5</p>\r\n<p id="8dcf329c-cf50-45c4-99dd-d817d2268671" class="">1 &le; t &le; 2 * 10^5</p>\r\n<h3 id="284fbfaf-25c4-48ea-8a0d-bca553a15d0d" class="">Solution</h3>\r\n<p id="d1b4d0df-dee5-4c6f-9755-ef6b57a87dec" class="">This seems easy at first, but it is not.</p>\r\n<p id="d8eb9f34-ffb2-430f-82d4-df0f5c54eca9" class="">It can be proved (I don't know how) that k &le; 3 for any input.</p>\r\n<ol id="7fe7d858-cbd6-4ce4-9ec8-5ca8218fe40e" class="numbered-list" start="1">\r\n<li>If all numbers are equal, k = 1 since we can assign all numbers one particular number.</li>\r\n</ol>\r\n<ol id="8da25acc-8079-4fce-a721-fe3727ec1c6b" class="numbered-list" start="2">\r\n<li>If the number of numbers are even, i.e. <em>n </em>is even, we can go with the intuition of assigning 1,2,1,2,1,2..., since now k &gt; 1, and we need to minimize k, so 1,2,1,2... is the best choice, since even if two elements are the same and they are still getting different numbers assigned to them, k is already 2.</li>\r\n</ol>\r\n<ol id="ac75f8e1-157e-4ac5-b396-7b75fe8a5845" class="numbered-list" start="3">\r\n<li>Here's the most complicated part. When <em>n</em> is odd.\r\n<p id="91a37492-ab9b-419d-a1b4-2c42da97c8aa" class="">The solution that I implemented is definitely not the shortest one, since I have too many if-else statements. But it got AC.</p>\r\n<p id="3771a860-0caf-4405-a672-5bba2be9d58c" class="">If n is odd, then if we assign 1,2,1,2,1,2... we may have a problem at element at index <em>n-1</em> since it may be different than <em>a[0]</em> but will get assigned the same number 1. You might say, aha! That's why k &le; 3. So now we can assign the last element, if it does not match with the first element and the second last element, a new number 3. Alas, this is a D problem.</p>\r\n<p id="e56ede9f-9e84-4034-be22-eb1d13c78ae3" class="">The problem with the above <em>aha!</em> solution is that it is possible that that test case could have been answered by k=2. How, you ask? Because we assigned alternating 1,2... to the elements, irrespective of whether they're the same or not. That was our mistake. It is possible that we could have assigned two adjacent elements with the same number, which would've lead to assigning the last element 1 or 2, given that it didn't violate any condition with <em>a[n-2]</em>.</p>\r\n<p id="541db6d1-a12c-4c0e-9412-a8721dd8ab36" class="">So we do exactly that. And, it might be tempting to merge all adjacent equal elements with the same number, but that won't work if you end up reversing the goal of assigning 1 or 2, if possible to the old number. (ODD-EVEN stuff).</p>\r\n<p id="b272bb2f-72bc-4e3f-8eb4-b96c86912468" class="">One solution is to just merge one such pair of two numbers, so that this case gets converted into the case where <em>n </em>is even.</p>\r\n</li>\r\n</ol>\r\n<p id="3836309f-b944-43c0-8ce7-8bf685a96db0" class="">Frankly, I'm still not crystal clear about this question</p>\r\n<h3 id="565eec63-bf72-43d0-9630-c5468576ca14" class="">Tutorial by Mike Mirzayanov:</h3>\r\n<p id="905ac87c-1aca-498e-8397-88035def4e89" class="">The answer to this problem is at most 3. Let's prove it by construction.</p>\r\n<p id="60e63c26-e385-4d93-aed7-fd6d2170925d" class="">Firstly, if all <em>𝑡𝑖 </em>are equal then the answer is 1. Otherwise, there are at least two different values in the array <em>𝑡 </em>so the answer is at least 2. If <em>𝑛 </em>is even then the answer is always 2 because you can color figures in the following way: [1,2,1,2,&hellip;,1,2]. If <em>𝑛 </em>is odd then consider two cases. The first case is when <strong>some</strong> <mark class="highlight-gray"><em>(read this as </em></mark><mark class="highlight-red"><em>at least one</em></mark><mark class="highlight-gray"><em>)</em></mark> pair of adjacent figures have the same type. Then the answer is 2 because you can merge these two values into one and get the case of even <em>𝑛</em>. Otherwise, all pairs of adjacent figures have different types and if you consider this cyclic array as a graph (cycle of length <em>𝑛</em>) then you can notice that it isn't bipartite so you need at least 3 colors to achieve the answer (color all vertices in such a way that any two adjacent vertices have different colors). And the answer looks like [1,2,1,2,&hellip;,1,2,3].</p>\r\n</div>	2020-04-28 18:43:56.511682	0	0	39	7	\N
11	Wave Motion	<p>Waves are present everywhere. Whether we recognize it or not, we encounter waves on a daily basis. We experience a variety of waves on daily basis including sound waves, radio waves, microwaves, water waves, visible light waves, sine waves, stadium waves, earthquake waves, cosine waves and waves on a string. Besides these waves we also experience various other motions which are similar to those of waves and are better referred as wavelike. These phenomena include the motion of a pendulum, the motion of a mass suspended by a spring and the motion of a child on a swing. Wave phenomena emerge in unexpected contexts. The flow of traffic along a road can support a variety of wave-like disturbances as anybody who has experienced a slowly moving traffic will know. The beat of your heart is regulated by spiral waves of chemical activity that swirl across its surface. You control the movement of your body through the action of electrochemical waves in your nervous system. Finally, quantum physics has revealed that, on a small enough scale, everything around us can only be described in terms of waves. The universe isn&rsquo;t really mechanical in nature. It&rsquo;s made of fields of force. When a radio antenna makes a disturbance in the electric and magnetic fields, those disturbances travel outward like ripples of water in a pond. In other words, waves are fundamental to the way the universe works.</p>\r\n<p><img style="margin: 5px; float: right; height: 200px; width: 347px;" title="Wavelength and Amplitude of a Wave" src="https://files.askiitians.com/cdn1/images/2015317-145245353-2231-350px-wave_characteristics.svg.png" alt="Wavelength and Amplitude of a Wave" />Wave motion is a mode of transmission of energy through a medium in the form of a disturbance. It is due to the repeated periodic motion of the particles of the medium about an equilibrium position transferring the energy from one particle to another.</p>\r\n<p>The waves are of three types - mechanical, electromagnetic and matter waves. Mechanical waves can be produced only in media<a id="waves-on-surface-of-water" name="waves-on-surface-of-water"></a> which possess elasticity and inertia. Water waves, sound waves and seismic waves are common examples of this type. Electromagnetic waves do not require any material medium for propagation. Radio waves, microwaves, infrared rays, visible light, the ultraviolet rays, X rays and &gamma; rays are electromagnetic waves. The waves associated with particles like electrons, protons and fundamental particles in motion are matter waves.</p>\r\n<h3><span style="color: #000000;"><strong>Waves on Surface of Water</strong></span></h3>\r\n<p>In order to understand the concept of wave motion, let us drop a stone in a trough of water. We find that small circular waves seem to originate from the point where the stone touches the surface of water. These waves spread out in all directions. It appears as if water moves away from that point. If a piece of paper is placed on the water surface, it will be observed that the piece of paper moves up and down, when the waves pass through it. This shows that the waves are formed due to the <a id="characteristics-of-wave-motion" name="characteristics-of-wave-motion"></a>vibratory motion of the water particles, about their mean position.</p>\r\n<p><img style="height: 150px; width: 300px; margin: 5px; float: right;" title="Waves on a Surface of Water" src="https://files.askiitians.com/cdn1/images/2015317-142736865-5179-water.gif" alt="Waves on a Surface of Water" />Wave motion is a form of disturbance which travels through a medium due to the repeated periodic motion of the particles of the medium about their mean position. The motion is transferred continuously from one particle to its neighbouring particle.</p>\r\n<div>\r\n<h3><span style="color: #000000;"><strong>Characteristics of Wave Motion</strong></span></h3>\r\n<p>(a) Wave motion is a form of disturbance travelling in the medium due to the periodic motion of the particles about their mean position.</p>\r\n</div>\r\n<p>(b) It is necessary that the medium should possess elasticity and&nbsp;inertia.</p>\r\n<p>(c) All the particles of the medium do not receive the disturbance at the same instant (i.e) each particle begins to vibrate a little later than its predecessor.</p>\r\n<p>(d) The wave velocity is different from the particle velocity. The velocity of a wave is constant for a given medium, whereas the velocity of the particles goes on changing and it becomes maximum in their mean position and zero in their extreme positions.</p>\r\n<p>(e) During the propagation of wave motion, there is transfer of energy from one particle to another without any actual transfer of the particles of the medium.</p>\r\n<p>(f) The waves undergo reflection, refraction, diffraction and interference. </p>	2020-04-28 18:45:24.239641	0	0	39	\N	\N
12	ACID properties in DBMS	<p>A <strong><a href="https://www.geeksforgeeks.org/sql-transactions/">transaction</a></strong> is a single logical unit of work which accesses and possibly modifies the contents of a database. Transactions access data using read and write operations.<br />In order to maintain consistency in a database, before and after the transaction, certain properties are followed. These are called <strong>ACID</strong> properties.</p>\r\n<p><a href="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20191121102921/ACID-Properties.jpg"><img class="aligncenter size-full wp-image-360707" style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20191121102921/ACID-Properties.jpg" alt="" width="886" height="545" /></a></p>\r\n<p><strong>Atomicity</strong><br />By this, we mean that either the entire transaction takes place at once or doesn&rsquo;t happen at all. There is no midway i.e. transactions do not occur partially. Each transaction is considered as one unit and either runs to completion or is not executed at all. It involves the following two operations.<br />&mdash;<strong>Abort</strong>: If a transaction aborts, changes made to database are not visible.<br />&mdash;<strong>Commit</strong>: If a transaction commits, changes made are visible.<br />Atomicity is also known as the &lsquo;All or nothing rule&rsquo;.</p>\r\n<p>&nbsp;</p>\r\n<div id="AP_G4GR_5">\r\n<div id="c9541d0b-2b1f-47f8-8b8b-63e4e11f2de9" class="_ap_apex_ad" style="display: block; clear: both; text-align: center; margin: 10px auto;" data-section="c9541d0b-2b1f-47f8-8b8b-63e4e11f2de9" data-xpath="#AP_G4GR_5" data-section-id="" data-render-time="1588079773421">\r\n<div id="ADP_40792_728X280_c9541d0b-2b1f-47f8-8b8b-63e4e11f2de9" style="text-align: center; margin: 0 auto;" data-google-query-id="CJfy0peai-kCFVGfaAodYMcJjw">&nbsp;</div>\r\n</div>\r\n</div>\r\n<p>&nbsp;</p>\r\n<p>Consider the following transaction <strong>T</strong> consisting of <strong>T1</strong> and <strong>T2</strong>: Transfer of 100 from account <strong>X</strong> to account <strong>Y</strong>.</p>\r\n<p><img class="aligncenter size-full" style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/uploads/11-6.jpg" alt="" width="356" height="146" /></p>\r\n<p>If the transaction fails after completion of <strong>T1</strong> but before completion of <strong>T2</strong>.( say, after <strong>write(X)</strong> but before <strong>write(Y)</strong>), then amount has been deducted from <strong>X</strong> but not added to <strong>Y</strong>. This results in an inconsistent database state. Therefore, the transaction must be executed in entirety in order to ensure correctness of database state.</p>\r\n<p>&nbsp;<br /><strong>Consistency</strong><br />This means that integrity constraints must be maintained so that the database is consistent before and after the transaction. It refers to the correctness of a database. Referring to the example above,<br />The total amount before and after the transaction must be maintained.<br />Total <strong>before T</strong> occurs = <strong>500 + 200 = 700</strong>.<br />Total <strong>after T occurs</strong> = <strong>400 + 300 = 700</strong>.<br />Therefore, database is <strong>consistent</strong>. Inconsistency occurs in case <strong>T1</strong> completes but <strong>T2</strong> fails. As a result T is incomplete.</p>\r\n<p>&nbsp;<br /><strong>Isolation</strong><br />This property ensures that multiple transactions can occur concurrently without leading to the inconsistency of database state. Transactions occur independently without interference. Changes occurring in a particular transaction will not be visible to any other transaction until that particular change in that transaction is written to memory or has been committed. This property ensures that the execution of transactions concurrently will result in a state that is equivalent to a state achieved these were executed serially in some order.<br />Let <strong>X</strong>= 500, <strong>Y</strong> = 500.<br />Consider two transactions <strong>T</strong> and <strong> T&rdquo;.</strong></p>\r\n<p><img class="aligncenter size-full" style="display: block; margin-left: auto; margin-right: auto;" src="https://media.geeksforgeeks.org/wp-content/uploads/22-1.jpg" alt="" width="313" height="143" /></p>\r\n<p>Suppose <strong>T</strong> has been executed till <strong>Read (Y)</strong> and then <strong>T&rsquo;&rsquo;</strong> starts. As a result , interleaving of operations takes place due to which <strong>T&rsquo;&rsquo;</strong> reads correct value of <strong>X</strong> but incorrect value of <strong>Y</strong> and sum computed by<br /><strong>T&rsquo;&rsquo;: (X+Y = 50, 000+500=50, 500)</strong><br />is thus not consistent with the sum at end of transaction: <strong><br />T: (X+Y = 50, 000 + 450 = 50, 450)</strong>.<br />This results in database inconsistency, due to a loss of 50 units. Hence, transactions must take place in isolation and changes should be visible only after they have been made to the main memory.</p>\r\n<p>&nbsp;<br /><strong>Durability:</strong><br />This property ensures that once the transaction has completed execution, the updates and modifications to the database are stored in and written to disk and they persist even if a system failure occurs. These updates now become permanent and are stored in non-volatile memory. The effects of the transaction, thus, are never lost.</p>\r\n<p>The <strong>ACID</strong> properties, in totality, provide a mechanism to ensure correctness and consistency of a database in a way such that each transaction is a group of operations that acts a single unit, produces consistent results, acts in isolation from other operations and updates that it makes are durably stored.</p>	2020-04-28 18:49:11.655106	0	0	38	3	\N
13	Plates problem	<div class="page-body">\r\n<h3 id="579de6ee-9d96-41e6-8983-de9528dc164d" class="" style="text-align: left;">Problem statement, simplified</h3>\r\n<p id="940e6d4d-3e76-45b8-84f5-e84b9042aa7e" class="">Given: n stacks each of size k. If p numbers need to be selected (only by p pop operations) then find maximum sum possible of those numbers</p>\r\n<h3 id="bb76a829-8a7d-40fd-a760-c18bc622520d" class="">Constraints</h3>\r\n<p id="a0c99ebd-1495-4c15-8080-bd1b6be45725" class="">&nbsp;</p>\r\n<p id="fc65848e-a499-43d8-a24b-19d02a01ce37" class="">1 &le; <strong>T </strong>&le; 100</p>\r\n<p id="63b4ddd2-ecf8-4906-970a-bc97a10dd221" class="">1 &le; <strong>K </strong>&le; 30</p>\r\n<p id="875f0ec1-74bd-4894-a896-0402f87b36de" class="">1 &le; <strong>P </strong>&le; <strong>N</strong>*<strong>K</strong></p>\r\n<h3 id="3888906f-2bef-499e-82a2-59801ea6b504" class="">Solution</h3>\r\n<p id="9e655a9b-aad4-42d9-9ad7-766cc1870881" class="">This is a dynamic programming problem.</p>\r\n<p id="676ba209-068c-456e-ab12-838f6f75b208" class="">We can store the input as a 2D array, stacks. Some intuition may lead you to store <em>cumulative sums</em> for each stack. We do this in a 2D array called sum.</p>\r\n<p id="a264728f-305b-42e4-9690-ddbb039da5f4" class="">Now comes the dp part. We make a 2D array dp, where:</p>\r\n<p id="9c81d40c-6c1b-408c-82bc-39ec1063a362" class="block-color-red"><code><em>dp[i][j]</em></code><em> stores the the max possible sum when we choose j numbers from the first i stacks.</em></p>\r\n<p id="afa2346f-357b-47a3-8b5e-2ca6da6726c7" class="">And, (try manually working out why this works):</p>\r\n<p id="4ed7233f-18e2-4ba1-be55-4daaf2364623" class=""><code>dp[i][j] = max(dp[i][j], sum[i][x] + dp[i-1][j-x])</code></p>\r\n<p id="3bf66771-a019-47a6-afc4-5daa3211b3b3" class=""><code>x</code> here denotes the number of numbers we choose from the ith stack. If we select total j stacks and we choose x from the ith stack, then we need to select <code>j-x</code> numbers from the previous i-1 stacks. And we have this number already stored as <code>dp[i-1][j-x]</code></p>\r\n<p id="368997a1-c55b-4c95-be3c-f9c065e79a84" class="">Hence, it's obvious that we need to try all x values from 0 to j. But the upper limit is not j, since it could be possible that there aren't enough numbers in a stack i.e. k &lt; j. Hence upper limit is min(j, k).</p>\r\n<p id="844c9c3a-70b5-4d9f-82c4-770d61c0fa6a" class="">We obviously need to run i from 1 to n, and j from 0 to p (note that the upper limit is p and not k).</p>\r\n<p id="f1b75bef-e63c-42c2-947d-147a7869f812" class="">Careful with the indexing here, one way is to use 1-based indexing, declare array sizes as one more than the given inputs, and putting dp[0][j] = 0 and dp[i][0] = 0.</p>\r\n</div>	2020-04-28 19:20:56.516662	0	0	37	7	\N
14	Demand and Supply	<p>Imagine the scenario: you arrive at the market to stock up on fruit, but it's been a bad year for apples, and supplies are low. The price has gone up, even since last week &ndash; but you accept the increase and snap them up anyway.</p>\r\n<p>On the plus side, there's been a bumper crop of pears. The growers are keen to sell as many as they can before their produce starts to rot, and they've slashed their prices accordingly. But you're in no hurry &ndash; you know that if you come back at the end of the day they'll be even cheaper.</p>\r\n<p>For most of us, as consumers, these basic laws of supply and demand are so familiar, they're almost second nature: plentiful goods are cheap; scarce goods cost more. But in business, these concepts are used in a more nuanced way to examine how much of a product consumers might buy at different prices, and the quantity you should offer to the market to maximize your revenue.</p>\r\n<p>In this article, we'll explore the relationship between supply and demand using simple graphs and tables, to help you make better pricing and supply decisions.</p>\r\n<h1>What Are Supply and Demand Curves?</h1>\r\n<h2 class="sub">Understanding Price and Quantity in the Marketplace</h2>\r\n<p>&nbsp;</p>\r\n<h2>The Law of Demand</h2>\r\n<p>Demand refers to how much of a product consumers are willing to purchase, at different price points, during a certain time period.</p>\r\n<p>We all have limited resources, and we have to decide what we're willing and able to buy. As an example, let's look at a simple model of the demand for gasoline.</p>\r\n<div class="grey_block">\r\n<h4>Note:</h4>\r\n<p>The gasoline prices example, used throughout this article, is for illustration only. It is not a description of the real gasoline market.</p>\r\n</div>\r\n<p>If the price of gas is $2.00 per liter, people may be willing and able to purchase 50 liters per week, on average. If the price drops to $1.75 per liter, they may buy 60 liters per week. At $1.50 per liter, they may buy 75 liters.</p>\r\n<p>You can express this information in a table, or &ldquo;schedule,&rdquo; like this:</p>\r\n<table class="quiztable alt auto_width">\r\n<thead>\r\n<tr>\r\n<th class="tal_center" colspan="2">Buyer Demand per Consumer</th>\r\n</tr>\r\n<tr>\r\n<th class="tal_center">Price per liter</th>\r\n<th class="tal_center">Quantity (liters)<br />demanded per week</th>\r\n</tr>\r\n</thead>\r\n<tbody>\r\n<tr>\r\n<td class="tal_center">$2.00</td>\r\n<td class="tal_center">50</td>\r\n</tr>\r\n<tr>\r\n<td class="tal_center">$1.75</td>\r\n<td class="tal_center">60</td>\r\n</tr>\r\n<tr>\r\n<td class="tal_center">$1.50</td>\r\n<td class="tal_center">75</td>\r\n</tr>\r\n<tr>\r\n<td class="tal_center">$1.25</td>\r\n<td class="tal_center">95</td>\r\n</tr>\r\n<tr>\r\n<td class="tal_center">$1.00</td>\r\n<td class="tal_center">120</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p>As the price of gas falls, the demand increases &ndash; people may choose to make more nonessential journeys in their leisure time, for example, or just top up their tanks if they anticipate an imminent price increase. But price is an obstacle to purchasing, so if the price rises again, less will be demanded.</p>\r\n<p>In other words, there is an "inverse" relationship between price and quantity demanded. This means that when you plot the schedule on a graph, you get a downward-sloping demand curve, as shown in Figure 1:</p>\r\n<div class="figure-container">\r\n<div class="figure" style="width: 550px;">\r\n<h4 class="figure-title">Figure 1: Demand Curve for Gasoline</h4>\r\n<img class="figure-img" src="https://www.mindtools.com/media/Diagrams/Suppy_and_Demand_Curves_1.jpg" alt="Demand Curve Example" width="550" height="" border="0" />\r\n<p class="figure-desc">&nbsp;</p>\r\n</div>\r\n</div>\r\n<h2>The Law of Supply</h2>\r\n<p>While demand explains the consumer side of purchasing decisions, supply relates to the seller's desire to make a profit. A supply schedule shows the amount of product that a supplier is willing and able to offer to the market, at specific price points, during a certain time period.</p>\r\n<div class="grey_block">\r\n<h4>Note:</h4>\r\n<p>Supply variations occur because production costs tend to vary by supplier. When the price is low, only producers with low costs can make a profit, so only they produce. When the price is high, even producers with high costs can make a profit, so everyone produces.</p>\r\n</div>\r\n<p>In our example, the schedule below shows that gas suppliers are willing to provide 50 liters per consumer per week at the low price of $1.20 per liter. But, if consumers will pay $2.15 per liter, suppliers will provide 120 liters per week. (Remember, we've assumed a simple economy in which gas companies sell directly to consumers.)</p>\r\n<table class="quiztable alt auto_width">\r\n<thead>\r\n<tr>\r\n<th class="tal_center" colspan="2">Gas Supply per Consumer</th>\r\n</tr>\r\n<tr>\r\n<th class="tal_center">Price per liter</th>\r\n<th class="tal_center">Quantity (liters)<br />supplied per week</th>\r\n</tr>\r\n</thead>\r\n<tbody>\r\n<tr>\r\n<td class="tal_center">$1.20</td>\r\n<td class="tal_center">50</td>\r\n</tr>\r\n<tr>\r\n<td class="tal_center">$1.30</td>\r\n<td class="tal_center">60</td>\r\n</tr>\r\n<tr>\r\n<td class="tal_center">$1.50</td>\r\n<td class="tal_center">75</td>\r\n</tr>\r\n<tr>\r\n<td class="tal_center">$1.75</td>\r\n<td class="tal_center">95</td>\r\n</tr>\r\n<tr>\r\n<td class="tal_center">$2.15</td>\r\n<td class="tal_center">120</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p>As the price rises, the quantity supplied rises, too. As the price falls, so does supply. This is a "direct" relationship, and the supply curve has an upward slope, as shown in Figure 2.</p>\r\n<div class="figure-container">\r\n<div class="figure" style="width: 550px;">\r\n<h4 class="figure-title">Figure 2: Supply Curve for Gasoline</h4>\r\n<img class="figure-img" src="https://www.mindtools.com/media/Diagrams/Suppy_and_Demand_Curves_2.jpg" alt="Supply Curve" width="550" height="" border="0" />\r\n<p class="figure-desc">&nbsp;</p>\r\n</div>\r\n</div>\r\n<h2>Using Supply and Demand to Set Price and Quantity</h2>\r\n<p>So, if suppliers want to sell at high prices, and consumers want to buy at low prices, how do you set the price you charge for your product or service? And how do you know how much of it to make available?</p>\r\n<p>Let's go back to our gas example. If oil companies try to sell their gas at $2.15 per liter, would it sell well? Probably not. If they lower the price to $1.20 per liter, they'll sell more as consumers will be happy. But will they make enough profit? And will there be enough supply to meet the higher demand by consumers? No, and no again.</p>\r\n<p>To determine the price and quantity of goods in the market, we need to find the price point where consumer demand equals the amount that suppliers are willing to supply. This is called the market "equilibrium." The central idea of a free market is that prices and quantities tend to move naturally toward equilibrium, and this keeps the market stable.</p>\r\n<h2>Equilibrium: Where Supply Meets Demand</h2>\r\n<p>Equilibrium is the point where demand for a product equals the quantity supplied. This means that there's no surplus and no shortage of goods.</p>\r\n<p>A shortage occurs when demand exceeds supply &ndash; in other words, when the price is too low. However, shortages tend to drive up the price, because consumers compete to purchase the product. As a result, businesses may hold back supply to stimulate demand. This enables them to raise the price.</p>\r\n<p>A surplus occurs when the price is too high, and demand decreases, even though the supply is available. Consumers may start to use less of the product, or purchase substitute products. To eliminate the surplus, suppliers reduce their prices and consumers start buying again.</p>\r\n<p>In our gas example, the market equilibrium price is $1.50, with a supply of 75 liters per consumer per week. This is represented by the point at which the supply and demand curves intersect, as shown in Figure 3.</p>\r\n<div class="figure-container">\r\n<div class="figure" style="width: 550px;">\r\n<h4 class="figure-title">Figure 3: Market Equilibrium</h4>\r\n<img class="figure-img" src="https://www.mindtools.com/media/Diagrams/Suppy_and_Demand_Curves_3.jpg" alt="Market Equilibrium" width="550" height="" border="0" />\r\n<p class="figure-desc">&nbsp;</p>\r\n</div>\r\n</div>\r\n<h2>Price Elasticity</h2>\r\n<p>When you consider what price to set for your product or service, it's important to remember that not all products behave in the same way. The extent to which the demand for your product is affected by the price you set is known as "price elasticity of demand."</p>\r\n<p>Inelastic products tend to be those that people always want to buy, but generally only in a fixed quantity. Electricity is an example of an inelastic product: if power companies lower the price of electricity, consumers probably won't use a lot more power in their homes, because they don't need more than they already use. But, if electricity prices rise, demand is unlikely to fall significantly, because people still need power.</p>\r\n<p>However, demand for inessential or luxury goods, such as restaurant meals, is highly elastic &ndash; consumers quickly choose to stop going to restaurants if prices go up.</p>\r\n<p>So, if demand for the products or services that your company offers is elastic, you may want to consider methods other than raising prices to increase your revenue &ndash; such as <a href="https://www.mindtools.com/pages/article/newSTR_63.htm" data-test="addrl1_public_plp_buttons_functions_addrl1">economies of scale</a></p>\r\n<p>&nbsp;or improving production <a href="https://www.mindtools.com/pages/article/newSTR_58.htm" data-test="addrl1_public_plp_buttons_functions_addrl1">efficiency</a>, for example.</p>\r\n<h2>&nbsp;</h2>\r\n<h2>Changes in Demand and Supply</h2>\r\n<p>As we've seen, a change in price usually leads to a change in the quantity demanded or supplied. But what happens when there's a long-term change in price?</p>\r\n<p>Let's return to our gas example. If there's a long-term increase in the price of gas, the pattern of demand changes. People may start walking or cycling to work, or buy more gas-efficient vehicles. The result is a major change in total demand and a major shift in the demand curve. And, with a shift in demand, the equilibrium point also changes.</p>\r\n<p>You can see this in Figure 4, where Demand Curve 2 differs from Demand Curve 1, from Figure 1. At each price point, the total demand is less, so the demand curve shifts to the left.</p>\r\n<div class="figure-container">\r\n<div class="figure" style="width: 550px;">\r\n<h4 class="figure-title">Figure 4: Demand Shifts</h4>\r\n<img class="figure-img" src="https://www.mindtools.com/media/Diagrams/Suppy_and_Demand_Curves_4.jpg" alt="Demand Shifts" width="550" height="" border="0" />\r\n<p class="figure-desc">&nbsp;</p>\r\n</div>\r\n</div>\r\n<p>Changes in any of the following factors can cause demand to shift:</p>\r\n<ul>\r\n<li>Consumer income.</li>\r\n<li>Consumer preference.</li>\r\n<li>Price and availability of substitute goods.</li>\r\n<li>Population.</li>\r\n</ul>\r\n<p>The same type of shift can occur with supply. When supply decreases, the supply curve shifts to the left. When supply increases, the supply curve shifts to the right. These changes have a corresponding effect on the equilibrium point.</p>\r\n<p>Changes in supply can result from events such as:</p>\r\n<ul>\r\n<li>Changes in production costs.</li>\r\n<li>Improved technology that makes production more efficient.</li>\r\n<li>Industry growth or shrinkage.</li>\r\n</ul>\r\n<p>To consider our example one more time, let's say that drilling costs have increased and the oil companies have reduced the supply of gas to the market (Supply 2). The result is a higher equilibrium price, as shown in Figure 5.</p>\r\n<div class="figure-container">\r\n<div class="figure" style="width: 550px;">\r\n<h4 class="figure-title">Figure 5: Change in Market Equilibrium</h4>\r\n<img class="figure-img" src="https://www.mindtools.com/media/Diagrams/Suppy_and_Demand_Curves_5.jpg" alt="Change in Market Equilibrium" width="550" height="" border="0" />\r\n<p class="figure-desc">&nbsp;</p>\r\n</div>\r\n</div>\r\n<p>You can use supply and demand curves like these to assess the potential impact of changes in the price that you charge for products and services, and to consider how shifts in supply and demand might affect your business.</p>\r\n<h4>Key Points</h4>\r\n<p>Although the phrase "supply and demand" is commonly used, it's not always understood in proper economic terms.</p>\r\n<p>The price and quantity of goods and services in the marketplace are largely determined by consumer demand and the amount that suppliers are willing to supply.</p>\r\n<p>Demand and supply can be plotted as curves, and the two curves meet at the equilibrium price and quantity. The market tends to naturally move toward this equilibrium &ndash; and when total demand and total supply shift, the equilibrium moves accordingly.</p>\r\n<p>Understanding this relationship is key to analyzing your market, and can help you to allocate your company's resources in the most cost-effective way.</p>	2020-04-28 19:23:49.670299	0	0	37	\N	\N
\.


--
-- Data for Name: post_file; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post_file (file_name, post_id) FROM stdin;
\.


--
-- Data for Name: subforum; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subforum (subforum_id, name, description, time_of_creation, creator_id) FROM stdin;
2	Programming	A subforum for students, enthusiasts and professionals in the amazing field of programming	2020-04-28 14:15:22.525802	4
3	Database Management	A subforum for students, enthusiasts and professionals in the amazing field of database management	2020-04-28 14:17:04.404179	37
5	JEE Physics	A subforum for students preparing for the Joint Entrance Examination for Engineering, focused on Physics	2020-04-28 14:19:58.064894	39
7	Competitive Programming	A subforum for students and enthusiasts for the amazing sport of competitive programming	2020-04-28 18:33:27.472162	39
\.


--
-- Data for Name: user_about; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_about (about, user_id) FROM stdin;
Eager to learn	37
Eager to learn	37
A software engineer currently working at Accuretta Systems, Bengaluru. Interested in database management, competitive programming and programming in general.	38
A software engineer currently working at Accuretta Systems, Bengaluru. Interested in database management, competitive programming and programming in general.	38
A software engineer currently working at Accuretta Systems, Bengaluru. Interested in database management, competitive programming and programming in general.	38
A software engineer currently working at Accuretta Systems, Bengaluru. Interested in database management, competitive programming and programming in general.	38
An second year engineering student at Veermata Jijabai Technological Institute Interested in database management, competitive programming and programming in general. Also interested in front-end web development and machine learning.	39
An second year engineering student at Veermata Jijabai Technological Institute Interested in database management, competitive programming and programming in general. Also interested in front-end web development and machine learning.	39
An second year engineering student at Veermata Jijabai Technological Institute Interested in database management, competitive programming and programming in general. Also interested in front-end web development and machine learning.	39
A data science graduate student at Chefla University, Chefland. Interested in commerce, finance, economics, accounting and politics.	40
A data science graduate student at Chefla University, Chefland. Interested in commerce, finance, economics, accounting and politics.	40
A data science graduate student at Chefla University, Chefland. Interested in commerce, finance, economics, accounting and politics.	40
Eager to learn and develop | SY Information Technology student at VJTI, Mumbai	41
Eager to learn and develop | SY Information Technology student at VJTI, Mumbai	41
Eager to learn and develop | SY Information Technology student at VJTI, Mumbai	41
Eager to learn and develop | SY Information Technology student at VJTI, Mumbai	41
Eager to learn and develop	42
Eager to learn and develop	42
Eager to learn and develop	42
Eager to learn and develop	42
\.


--
-- Data for Name: user_community; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_community (user_id, community_id) FROM stdin;
38	2
42	2
\.


--
-- Data for Name: user_interest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_interest (interest, user_id) FROM stdin;
math	1
math	2
math	3
math	4
finance	5
finance	6
economics	6
accounting	6
tax	6
finance	7
economics	7
finance	8
economics	8
accounting	8
tax	8
banking	8
c++	8
finance	9
economics	9
accounting	9
tax	9
banking	9
finance	10
economics	10
accounting	10
finance	11
economics	11
accounting	11
tax	11
finance	12
economics	12
accounting	12
tax	12
finance	13
economics	13
accounting	13
tax	13
banking	13
finance	14
economics	14
finance	15
finance	16
c++	17
python	17
html	17
c++	18
python	18
html	18
css	18
c++	19
c++	20
python	20
html	20
css	20
javascript	20
java	20
c++	21
python	21
html	21
css	21
c++	22
python	22
html	22
c++	23
python	23
c++	24
python	24
html	24
css	24
c++	25
c++	26
python	26
dbms	27
computer-science	27
dbms	28
dbms	29
computer-science	29
dbms	30
computer-science	30
information-technology	30
sql	30
database	30
math	30
dbms	31
computer-science	31
information-technology	31
sql	31
database	31
math	31
dbms	32
computer-science	32
information-technology	32
sql	32
database	32
dbms	33
dbms	34
computer-science	34
information-technology	34
dbms	35
computer-science	35
information-technology	35
dbms	36
computer-science	36
information-technology	36
database	37
computer-science	37
web	37
competitive-programming	37
computer-science	38
competitive-programming	38
database	38
sql	38
programming	38
database	39
computer-science	39
programming	39
competitive-programming	39
c	39
c++	39
finance	40
economics	40
accounting	40
fintech	40
data-science	40
business	40
competitive-programming	41
computer-science	41
python	41
automata-theory	41
flask	41
robotics	41
IOT	41
MQTT	41
computer-science	42
math	42
robotics	42
IOT	42
machine-learning	42
deep-learning	42
\.


--
-- Data for Name: user_qualification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_qualification (qualification, user_id) FROM stdin;
IGCSE	1
IGCSE	2
IGCSE	3
IGCSE	4
HSC	4
BTECH	4
CS	5
MD	5
CA	5
IGCSE	6
BBA	6
BTech	6
SSC	7
MBBS	7
BSc	7
BSc	8
MA	8
CA	9
DNB	9
CS	9
MBBS	9
MBBS	10
DNB	10
MBBS	11
BTech	11
LLM	11
BBA	11
BMS	12
PhD	12
BTech	12
LLM	12
DNB	13
BA	13
LLM	13
MBBS	13
BBA	14
MA	14
BA	15
MTech	15
MSc	15
BMS	15
CS	16
BMS	16
CS	17
IGCSE	17
DNB	18
IGCSE	18
MSc	18
MSc	19
DNB	19
LLM	19
BE	20
DNB	20
MSc	20
BMS	20
BCom	21
CS	21
BBA	22
CA	22
LLM	22
CS	23
BSc	23
MSc	24
MTech	24
PhD	24
BSc	25
CS	25
MA	26
LLB	26
MSc	27
BE	27
BCom	27
MTech	27
MD	28
BA	28
BBA	28
LLM	28
BBA	29
PhD	29
CA	30
LLM	30
MTech	30
DNB	31
BA	31
MBBS	32
BBA	32
SSC	32
MA	33
IGCSE	33
PhD	33
MTech	33
MSc	34
BSc	34
LLM	34
BCom	34
SSC	35
BMS	35
MA	36
MSc	36
IGCSE	37
HSC	37
ICSE	38
HSC	38
BTech	38
MSc	38
CBSE	39
HSC	39
BTech	39
IGCSE	40
A-levels	40
BAF	40
\.


--
-- Data for Name: user_subforum; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_subforum (user_id, subforum_id) FROM stdin;
37	2
42	5
42	3
38	3
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, first_name, last_name, email, password, dob, profile_image_name) FROM stdin;
1	u1	U1	U1	u1@user.com	$2a$10$0P7ciZtKI33259DQ8PFVxeMU2rpyyLiyBA09b/8cN0QqII8dkIQ7e	2019-12-31	\N
2	u2	U2	U2	u2@user.com	$2a$10$kSQnR3sKEeFQVDy.W23jkejp6YocyQdDXysbJxlJSoj8zxuzKVIcG	2019-11-30	\N
3	u3	U3	U3	u3@user.com	$2a$10$FxsG1buW3WHYkXWkr5MRj..jgdWDn9yvUFFrzviQ4OkSRn6tTKQAC	2020-12-30	\N
4	akshatshah21	Akshat	Shah	akshat@akshat.in	$2a$10$geoqw8n0zrfXA6YIKalQ4.JYFZkfEfQnVSr5ZRCmkzzRHcdFvAcS6	2000-08-21	\N
5	pwyvill0	Pattie	Wyvill	pwyvill0@1688.com	$2a$10$YZNfWIEKLl12pmzcHe5WjufE2bX.DLZlcIy5logoWgtfXgHGw5rC2	1983-06-05	\N
6	hgrestye1	Hinze	Grestye	hgrestye1@lycos.com	$2a$10$pNu4/c/jN9VdG7b4wp0fue3GlRP8qfmbLJRSOlxJBR/w2J1xpwT7e	1968-06-17	\N
7	lbrolechan2	Lyell	Brolechan	lbrolechan2@adobe.com	$2a$10$63ZgaQT4/U5LsDFIHY6NsuGPiufzILCc7oaJMb8WRyO3z5TW69JJ2	2011-09-16	\N
8	rwatkiss3	Robbert	Watkiss	rwatkiss3@cbsnews.com	$2a$10$n/ZCxFZLIMtFQaMILNBawObH4JIb.16s4YV.yb0QVfVke4EQUKjI2	1984-08-20	\N
9	rhugo4	Rossy	Hugo	rhugo4@tamu.edu	$2a$10$tMQtaaEBRuGjdTaA84ZDfejhiL60pfcf7TGeDwcYLj9oapoSR/9ym	1973-06-08	\N
10	sslainey5	Schuyler	Slainey	sslainey5@blogspot.com	$2a$10$OOP8wptNDURYLufdyFlX8.xkUKPpniOa3NHaefE9o.WVeckV5PQ3S	2000-01-18	\N
11	hmacauley6	Hal	Macauley	hmacauley6@fc2.com	$2a$10$Kn4.sLvrrTNINooOZkKLfel4QMWtGeP056bmxsYtwEtJq.Gx0Tf4a	2011-12-21	\N
12	lcoveny7	Linnet	Coveny	lcoveny7@behance.net	$2a$10$V9N7eTKw7WxH3SAskKimauomGZyEkkGdcyHX5GshmqQwp.e5p2NYi	1992-01-08	\N
13	lcestard8	Libbie	Cestard	lcestard8@cdbaby.com	$2a$10$zqFxbhmhpvJQFS60rQAzgeR8O39xoYVCB5axO2kjgYRyb2j7ibNiG	2018-02-17	\N
14	lcarty9	Lynnett	Carty	lcarty9@chicagotribune.com	$2a$10$FXHsQ0VvdcrW.ow78UDcLOv2gerKyW5uAE/kgbSIk6pSIE4iKIRSu	1985-07-04	\N
15	lskelcher0	Lavena	Skelcher	lskelcher0@irs.gov	$2a$10$VKSq/NAefl9ma.uNmHJZ6uSOaDWDsunADnKGJNXeASaBfaXOS8amG	1993-05-29	\N
16	jextal1	Jilly	Extal	jextal1@marriott.com	$2a$10$uFOyPryeTKlRZClp/.UG/O.unEZT4gYWMLItrfi4ZU4/yAbxDV4Im	1978-11-12	\N
17	rrayment0	Rudolfo	Rayment	rrayment0@slashdot.org	$2a$10$UZtlL0Q8QpW3kAlqO46OhOd3OE1UvB41GeelxRBkfBVRF7yLNMT2i	2010-04-19	\N
18	cpersich1	Cheryl	Persich	cpersich1@harvard.edu	$2a$10$retDt02JzOOy1wUk0iu9kODqIQ2EhKxE3asqjbGjrnLahofytgBDC	1989-09-16	\N
19	tmacdaid2	Tomas	MacDaid	tmacdaid2@mac.com	$2a$10$Urd8dJKrH5OpdwLvO9MYLO9DH7IMtxbw.ZVLm7H/zK/AaRxMnGXjq	1995-07-18	\N
20	vmuffin3	Valencia	Muffin	vmuffin3@timesonline.co.uk	$2a$10$O76sCKXgOH94uO/RmZL0JO0Wq9aKYcA7nMkxCUDHRXPwkcOPHzzc6	2009-06-15	\N
21	omatuschek4	Olenka	Matuschek	omatuschek4@time.com	$2a$10$GGfKePxN6Ab21o1.1z8iC.YcfyyBO7naDauBwQL3Qzf7bvyhUQ2jC	1976-10-10	\N
22	zberthel5	Zebadiah	Berthel	zberthel5@addthis.com	$2a$10$ZtVYaHNh0AZI6yBJIHviwesNES1Fw/foZzxa5qaAycbe7FLd9SkMa	1997-04-05	\N
23	basson6	Biddie	Asson	basson6@reference.com	$2a$10$32iZ8hqggHnwbTHQGYgSauZjRewtfRiDzmm6d6jJ.ep1USjs3ADQe	1965-05-08	\N
24	hmcleman7	Hilliary	McLeman	hmcleman7@java.com	$2a$10$8NDUKDFQbaKfYYSpNm615u0wKvWQBicCqlOG2F1v9r24aLYUMx.dO	1996-10-24	\N
25	nkennerley8	Nancie	Kennerley	nkennerley8@desdev.cn	$2a$10$lwmcs6RZIgRi7mB0Y/gM6u0ADxxrlpYzP37krQzo2injCZc3P00xy	1989-07-02	\N
26	ddeavenell9	Devora	De Avenell	ddeavenell9@soundcloud.com	$2a$10$L.p5g0m71o7EpcTV2WkKp.qYd.8tacfsbK1a2RTkKSY8z6dibNcde	2002-10-08	\N
27	jseer0	Johnnie	Seer	jseer0@narod.ru	$2a$10$6IaCKB7dvCd17RM0m6cvK.4znDEI5pl.B2NLkUS2nbl292dbvNU4O	1975-12-01	\N
28	fwhiterod1	Flem	Whiterod	fwhiterod1@globo.com	$2a$10$YYOKFXUCA72ZWMXZeJd9KOJq/31XHCgBJzqIcwf/gUAZDMiGIinBy	2010-08-06	\N
29	cchurchill2	Charlton	Churchill	cchurchill2@reference.com	$2a$10$zqixFWHELTFd53TjJRXrLuepFaQep1BtYkLdL4y5GaFEdpSHh9qgO	2001-12-09	\N
30	elillo3	Emmett	Lillo	elillo3@twitpic.com	$2a$10$UH2Jv9TrfniZl12OGizeIumWmnxSuL2fUjXFrli9j7J4j/wD72vPi	1972-09-19	\N
31	rpioli4	Roderigo	Pioli	rpioli4@google.es	$2a$10$VFK3TTacnPMuA1EgosPwgOroF4LxnwFX1pOcZZCvNvEt5ldpoNR6C	1977-04-19	\N
32	bhaymes5	Broderic	Haymes	bhaymes5@newsvine.com	$2a$10$83ssUnWXVd5R8VV0DPq8O.PtHc8syTLdXMs0OCs6mQDTXS587O7TG	1997-12-12	\N
33	emcphelim6	Eula	McPhelim	emcphelim6@shinystat.com	$2a$10$G9dU72kiSS/ooDy77EI/xekfxY8OP/n/hsXT2.KhirNCvE7MzGTci	1992-02-13	\N
34	mdecruse7	Marlane	Decruse	mdecruse7@thetimes.co.uk	$2a$10$pox6m.FCY3HRQb46LfZ7hO5vS3M6ssfN1k9eLCNJGkA4yKL.9ny/O	2008-05-16	\N
35	jlongstaff8	Joleen	Longstaff	jlongstaff8@wikimedia.org	$2a$10$YMpRzrSSSq0uoacq6s3adOnCW/fU6ZqtTQrkSIDHyE8tib1ZrnlZ2	1988-06-18	\N
36	abebbington9	Adrien	Bebbington	abebbington9@github.com	$2a$10$Z0LljCYGQptX0fkmTQ8vdueld8FTeI2P29kMP6N8vzSWzktbQyyhO	1995-11-26	\N
40	ajay_shukla	Ajay	Shukla	ajayshukla@mail.in	$2a$10$YrsTij8Fhug8XHlM6Pvc.O11u.S3tevCyPrNENeDzpomBaxlWYl7q	1995-09-05	\N
38	ramesh_s	Ramesh	Soni	rameshsoni@mail.in	$2a$10$DIeXurnGd9xeF5kLrOwRy.YGVYPyr3DhYgf.PuMKR9kPBpY.fl62e	1985-05-21	myFile-1588064192987.jpg
41	ganadhish1999	Ganadhish	Acharekar	acharekarganadhish1999@gmail.com	$2a$10$BfuI9CwyDfvzafSly.4dQ.VpqiCfueRAovRECFiyIq/7gGFdjyGhq	1999-11-11	\N
42	saharshj_9.85	Saharsh	Jain	saharshjain2000@gmail.com	$2a$10$FHWm9Q/VHn2gbwCorZwc3ezivJRzRlA0F2VtHwaw/uKZdyk1jEneS	1999-11-11	\N
37	akshatshah_21	Akshat	Shah	akshatshah_21@yahoo.in	$2a$10$IGQsrzmBVzht2kxsRrJyOeHenMldpoz4hv2.7b4tVPdbGPHGSugRS	2000-08-21	myFile-1588082042430.jpg
39	nikita_sharma	Nikita	Sharma	nikitasharma@mail.in	$2a$10$oFU0Xs/3vZDH4V1f8teP5uS8CUiHSnADslcHDluNL4nmFuLSFOEVi	1999-09-02	myFile-1588082080497.jpg
\.


--
-- Name: chat_chat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_chat_id_seq', 6, true);


--
-- Name: child_comment_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.child_comment_comment_id_seq', 1, true);


--
-- Name: comment_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comment_comment_id_seq', 2, true);


--
-- Name: community_community_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.community_community_id_seq', 2, true);


--
-- Name: feedback_feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.feedback_feedback_id_seq', 1, false);


--
-- Name: message_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.message_message_id_seq', 75, true);


--
-- Name: post_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.post_post_id_seq', 14, true);


--
-- Name: subforum_subforum_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subforum_subforum_id_seq', 7, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 42, true);


--
-- Name: chat chat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (chat_id);


--
-- Name: child_comment child_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.child_comment
    ADD CONSTRAINT child_comment_pkey PRIMARY KEY (comment_id);


--
-- Name: comment comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (comment_id);


--
-- Name: community community_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community
    ADD CONSTRAINT community_name_key UNIQUE (name);


--
-- Name: community community_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community
    ADD CONSTRAINT community_pkey PRIMARY KEY (community_id);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (feedback_id);


--
-- Name: message message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (message_id);


--
-- Name: post post_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_pkey PRIMARY KEY (post_id);


--
-- Name: subforum subforum_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subforum
    ADD CONSTRAINT subforum_name_key UNIQUE (name);


--
-- Name: subforum subforum_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subforum
    ADD CONSTRAINT subforum_pkey PRIMARY KEY (subforum_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: category category_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.post(post_id);


--
-- Name: category category_subforum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_subforum_id_fkey FOREIGN KEY (subforum_id) REFERENCES public.subforum(subforum_id);


--
-- Name: chat chat_user1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_user1_fkey FOREIGN KEY (user1) REFERENCES public.users(username);


--
-- Name: chat chat_user2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_user2_fkey FOREIGN KEY (user2) REFERENCES public.users(username);


--
-- Name: child_comment child_comment_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.child_comment
    ADD CONSTRAINT child_comment_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(user_id);


--
-- Name: child_comment child_comment_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.child_comment
    ADD CONSTRAINT child_comment_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.comment(comment_id);


--
-- Name: comment comment_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(user_id);


--
-- Name: comment comment_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.post(post_id);


--
-- Name: community community_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.community
    ADD CONSTRAINT community_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(user_id);


--
-- Name: feedback feedback_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: message message_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chat(chat_id);


--
-- Name: message message_receiver_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_receiver_fkey FOREIGN KEY (receiver) REFERENCES public.users(username);


--
-- Name: message message_sender_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_sender_fkey FOREIGN KEY (sender) REFERENCES public.users(username);


--
-- Name: pending_requests pending_requests_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_requests
    ADD CONSTRAINT pending_requests_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.community(community_id);


--
-- Name: pending_requests pending_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pending_requests
    ADD CONSTRAINT pending_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: post post_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(user_id);


--
-- Name: post post_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.community(community_id);


--
-- Name: post_file post_file_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_file
    ADD CONSTRAINT post_file_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.post(post_id);


--
-- Name: post post_subforum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_subforum_id_fkey FOREIGN KEY (subforum_id) REFERENCES public.subforum(subforum_id);


--
-- Name: subforum subforum_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subforum
    ADD CONSTRAINT subforum_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(user_id);


--
-- Name: user_about user_about_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_about
    ADD CONSTRAINT user_about_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: user_community user_community_community_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_community
    ADD CONSTRAINT user_community_community_id_fkey FOREIGN KEY (community_id) REFERENCES public.community(community_id);


--
-- Name: user_community user_community_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_community
    ADD CONSTRAINT user_community_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: user_interest user_interest_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_interest
    ADD CONSTRAINT user_interest_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: user_qualification user_qualification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_qualification
    ADD CONSTRAINT user_qualification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: user_subforum user_subforum_subforum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_subforum
    ADD CONSTRAINT user_subforum_subforum_id_fkey FOREIGN KEY (subforum_id) REFERENCES public.subforum(subforum_id);


--
-- Name: user_subforum user_subforum_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_subforum
    ADD CONSTRAINT user_subforum_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

