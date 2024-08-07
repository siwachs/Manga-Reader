import { useRef, useState, useEffect, ReactElement } from "react";
import { useNestedCommentSystem } from "@/contexts/nestedCommentContext";
import { useToastContainer } from "@/contexts/toastContainerContext";

import sanatizeHtml from "@/libs/sanitizeHtml";
import uuidv4 from "@/libs/uuidv4";

import { PiGifFill } from "react-icons/pi";
import { AiFillPicture } from "react-icons/ai";
import { RxFontStyle } from "react-icons/rx";
import {
  MdFormatBold,
  MdOutlineFormatItalic,
  MdFormatUnderlined,
  MdStrikethroughS,
} from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaCode } from "react-icons/fa6";
import { RiLinksFill } from "react-icons/ri";
import { BiSolidHide } from "react-icons/bi";

const placeholder = `<div className="pointer-events-none absolute top-0 mt-5 w-auto max-w-full select-none font-[Arial] font-normal text-black opacity-[0.333]"><p className="leading-[1.4]">Join the discussion…</p></div>`;

const editorToolboxButtonClasses =
  "flex size-6 items-center justify-center rounded text-[var(--app-text-color-medium-gray-blue)] opacity-60 hover:opacity-100 data-[active=true]:opacity-100 data-[active=true]:bg-[var(--app-text-color-light-blue-gray)]";
const editorToolboxButtonIconClasses = "size-5";

const initialActiveTools = {
  isToolboxActive: false,
  isBoldStyleActive: false,
  isItalicStyleActive: false,
  isUnderlineStyleActive: false,
  isStrikethroughStyleActive: false,
  isAddLinkActive: false,
  isSpoilerStyleActive: false,
  isCodeStyleActive: false,
};

type ActiveTools =
  | "isToolboxActive"
  | "isBoldStyleActive"
  | "isItalicStyleActive"
  | "isUnderlineStyleActive"
  | "isStrikethroughStyleActive"
  | "isAddLinkActive"
  | "isSpoilerStyleActive"
  | "isCodeStyleActive";

const tools = [
  {
    key: "bold",
    activeKey: "isBoldStyleActive",
    className: editorToolboxButtonClasses,
    title: "Bold",
    icon: <MdFormatBold className="size-7" />,
  },
  {
    key: "italic",
    activeKey: "isItalicStyleActive",
    className: editorToolboxButtonClasses,
    title: "Italic",
    icon: <MdOutlineFormatItalic className="size-7" />,
  },
  {
    key: "underline",
    activeKey: "isUnderlineStyleActive",
    className: editorToolboxButtonClasses,
    title: "Underline",
    icon: <MdFormatUnderlined className="size-7" />,
  },
  {
    key: "strikethrough",
    activeKey: "isStrikethroughStyleActive",
    className: editorToolboxButtonClasses,
    title: "StrikeThrough",
    icon: <MdStrikethroughS className="size-7" />,
  },
  {
    key: "link",
    activeKey: "isAddLinkActive",
    className: editorToolboxButtonClasses,
    title: "Add Link",
    icon: <RiLinksFill className="size-5" strokeWidth={1} />,
  },
  {
    key: "spoiler",
    activeKey: "isSpoilerStyleActive",
    className: editorToolboxButtonClasses,
    title: "Spoiler",
    icon: <BiSolidHide className="size-5" />,
  },
  {
    key: "code",
    activeKey: "isCodeStyleActive",
    className: editorToolboxButtonClasses,
    title: "Code",
    icon: <FaCode className="size-[18px]" />,
  },
];

const CommentForm: React.FC<{
  initialMessage?: string;
  parentId?: string;
  commentId?: string;
  callback?: () => void;
  editMode?: boolean;
}> = ({
  initialMessage = "",
  parentId = "root",
  commentId,
  callback,
  editMode,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToastContainer();
  const { userId, contentId, chapterId, makeComment, editComment } =
    useNestedCommentSystem();

  const [expandedEditor, setExpandedEditor] = useState(false);
  const [activeTools, setActiveTools] = useState(initialActiveTools);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialMessage;
    }
  }, [initialMessage]);

  useEffect(() => {
    applyStyle();
  }, [
    activeTools.isBoldStyleActive,
    activeTools.isItalicStyleActive,
    activeTools.isCodeStyleActive,
    activeTools.isSpoilerStyleActive,
    activeTools.isStrikethroughStyleActive,
    activeTools.isUnderlineStyleActive,
  ]);

  const applyStyle = () => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    const range = selection.getRangeAt(0);

    let wrapper = null;
    if (activeTools.isCodeStyleActive && activeTools.isSpoilerStyleActive) {
      wrapper = document.createElement("spoiler-tag");
      wrapper.setAttribute("data-active", "true");
      wrapper.appendChild(document.createElement("code"));
    } else if (activeTools.isCodeStyleActive)
      wrapper = document.createElement("code");
    else if (activeTools.isSpoilerStyleActive) {
      wrapper = document.createElement("spoiler-tag");
      wrapper.setAttribute("data-active", "true");
    } else if (
      activeTools.isBoldStyleActive ||
      activeTools.isItalicStyleActive ||
      activeTools.isUnderlineStyleActive ||
      activeTools.isStrikethroughStyleActive
    )
      wrapper = document.createElement("span");

    if (wrapper === null) {
      const editor = editorRef.current as Node;
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.setStart(editor, editor?.childNodes.length);
      return selection.addRange(newRange);
    }

    if (activeTools.isBoldStyleActive) wrapper.style.fontWeight = "bold";
    if (activeTools.isItalicStyleActive) wrapper.style.fontStyle = "italic";
    if (activeTools.isUnderlineStyleActive)
      wrapper.style.textDecoration = "underline";
    if (activeTools.isStrikethroughStyleActive)
      wrapper.style.textDecoration = "line-through";

    // Use DocumentFragment to safely insert styled content
    const fragment = range.extractContents();
    wrapper.appendChild(fragment);
    editorRef.current?.appendChild(wrapper);

    // Reselect the new styled content
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(wrapper);
    selection.addRange(newRange);
  };

  const updateActiveTools = (key: keyof typeof activeTools) => {
    setActiveTools((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId)
      return addToast({
        id: uuidv4(),
        type: "info",
        text: "You need to sign in for that.",
      });

    const message = editorRef.current?.innerHTML!;
    const innerText = editorRef.current?.innerText;

    if (innerText?.trim() === "" || innerText === "<br>")
      return addToast({
        id: uuidv4(),
        type: "warning",
        text: "Message can't be empty.",
      });

    if (editorRef.current) editorRef.current.innerHTML = "";
    setExpandedEditor(false);
    setActiveTools(initialActiveTools);
    if (callback) callback();

    if (editMode) {
      await editComment({ userId, message: sanatizeHtml(message) }, commentId);
    } else {
      await makeComment({
        contentId,
        chapterId,
        userId,
        parentId,
        message: sanatizeHtml(message),
      });
    }
  };

  return (
    <form onSubmit={submitComment} className="my-4">
      <div className="rounded-2xl border-2 border-[var(--app-border-color-grayish-blue)]">
        <div
          role="textbox"
          ref={editorRef}
          onFocus={() => setExpandedEditor(true)}
          spellCheck
          contentEditable
          className={`relative max-h-[350px] ${expandedEditor ? "min-h-[115px] border-b-2" : "min-h-[65px]"} max-w-full overflow-y-auto whitespace-pre-wrap break-words p-5 leading-[1.4] outline-none transition-all`}
        />

        <div
          className={`${expandedEditor ? "rounded-b-2xl p-[5px_6px]" : "hidden"}`}
        >
          <div className="flex justify-between">
            <div className="inline-flex items-center gap-1.5">
              <button type="button" className={editorToolboxButtonClasses}>
                <PiGifFill className={editorToolboxButtonIconClasses} />
              </button>

              <button type="button" className={editorToolboxButtonClasses}>
                <AiFillPicture className={editorToolboxButtonIconClasses} />
              </button>

              <span className="mx-0.5 inline-block h-6 w-0.5 bg-[var(--app-border-color-grayish-blue)]" />

              {tools.map((tool) => (
                <button
                  key={tool.key}
                  data-active={activeTools[tool.activeKey as ActiveTools]}
                  type="button"
                  onClick={() =>
                    updateActiveTools(tool.activeKey as ActiveTools)
                  }
                  className={`${tool.className} show-tool hidden`}
                  title={tool.title}
                >
                  {tool.icon}
                </button>
              ))}

              <button
                data-active={activeTools.isToolboxActive}
                type="button"
                onClick={() => updateActiveTools("isToolboxActive")}
                className={`${editorToolboxButtonClasses} hide-mobile-toolbox-toogle`}
              >
                <RxFontStyle
                  strokeWidth={0.2}
                  className={editorToolboxButtonIconClasses}
                />
              </button>
            </div>

            <button
              disabled={!userId}
              type="submit"
              className="h-fit whitespace-nowrap rounded-[14px] bg-[var(--app-text-color-gunmelt-gray)] p-[3.5px_15px] text-[15px] font-bold text-white hover:border-[#526069] hover:bg-[#526069] disabled:bg-[#526069]"
            >
              Comment
            </button>
          </div>

          <div
            className={
              activeTools.isToolboxActive
                ? "hide-mobile-toolbox mt-1.5 grid grid-flow-col gap-1.5"
                : "hidden"
            }
          >
            {tools.map((tool) => (
              <button
                key={tool.key}
                data-active={activeTools[tool.activeKey as ActiveTools]}
                type="button"
                onClick={() => updateActiveTools(tool.activeKey as ActiveTools)}
                className={tool.className}
                title={tool.title}
              >
                {tool.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2.5">
        <h6 className="mb-2.5 text-[11px] font-bold uppercase not-italic leading-[1] text-[var(--app-text-color-blue-gray)]">
          Log in with
        </h6>

        <div className="mb-[18px]">
          <button
            type="button"
            className="opacity-90 transition-opacity hover:opacity-100"
          >
            <FcGoogle className="size-9" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
