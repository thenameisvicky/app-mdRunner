"use client";

import React, { useState, useMemo } from "react";
import { marked } from "marked";
import type { Tokens } from "marked";

type MarkdownNode = {
  type: "heading" | "content";
  level?: number;
  text?: string;
  html?: string;
  children: MarkdownNode[];
  id: string;
};

type CollapsibleSectionProps = {
  node: MarkdownNode;
  isExpanded: boolean;
  onToggle: () => void;
  depth: number;
};

function CollapsibleSection({
  node,
  isExpanded,
  onToggle,
  depth,
}: CollapsibleSectionProps) {
  const headingId = `heading-${node.id}`;
  const headingLevel = node.level || 1;
  const headingClassName = `collapsible-heading m-0 flex-1 text-[#37352f] ${
    headingLevel === 1
      ? "font-bold text-[32px] leading-[1.2]"
      : headingLevel === 2
        ? "font-semibold text-2xl leading-[1.3]"
        : "font-semibold text-xl leading-[1.3]"
  }`;

  const renderHeading = () => {
    const props = {
      id: headingId,
      className: headingClassName,
      dangerouslySetInnerHTML: { __html: node.html || "" } as { __html: string },
    };

    switch (headingLevel) {
      case 1:
        return <h1 {...props} />;
      case 2:
        return <h2 {...props} />;
      case 3:
        return <h3 {...props} />;
      default:
        return <h3 {...props} />;
    }
  };

  return (
    <div className="collapsible-section" data-depth={depth}>
      <div
        className="collapsible-heading-wrapper flex items-center cursor-pointer select-none mb-0.5"
        style={{
          paddingLeft: `${depth * 8}px`,
          marginTop: depth === 0 ? "0" : "0.5em",
        }}
        onClick={onToggle}
      >
        <div
          className="collapsible-toggle w-[18px] h-[18px] flex items-center justify-center mr-1.5 -ml-6 shrink-0 text-[#787774] transition-all duration-200 ease-in-out"
          style={{
            transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 2L7 5L3 8" />
          </svg>
        </div>
        {renderHeading()}
      </div>
      {node.children.length > 0 && (
        <div
          className={`collapsible-content ${isExpanded ? "block" : "hidden"}`}
          style={{
            paddingLeft: `${depth * 8 + 24}px`,
            textAlign: "left",
          }}
        >
          {node.children.map((child) => {
            if (child.type === "heading") {
              return (
                <CollapsibleMarkdownContent
                  key={child.id}
                  nodes={[child]}
                  depth={depth + 1}
                />
              );
            } else {
              return (
                <div
                  key={child.id}
                  className="markdown-content-block"
                  dangerouslySetInnerHTML={{ __html: child.html || "" }}
                />
              );
            }
          })}
        </div>
      )}
    </div>
  );
}

type CollapsibleMarkdownContentProps = {
  nodes: MarkdownNode[];
  depth?: number;
};

function CollapsibleMarkdownContent({
  nodes,
  depth = 0,
}: CollapsibleMarkdownContentProps) {
  const getAllHeadingIds = (nodeList: MarkdownNode[]): string[] => {
    const ids: string[] = [];
    for (const node of nodeList) {
      if (node.type === "heading") {
        ids.push(node.id);
        const nestedHeadings = node.children.filter((c) => c.type === "heading");
        if (nestedHeadings.length > 0) {
          ids.push(...getAllHeadingIds(nestedHeadings));
        }
      }
    }
    return ids;
  };

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(getAllHeadingIds(nodes))
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <>
      {nodes.map((node) => {
        if (node.type === "heading") {
          const isExpanded = expandedSections.has(node.id);
          return (
            <CollapsibleSection
              key={node.id}
              node={node}
              isExpanded={isExpanded}
              onToggle={() => toggleSection(node.id)}
              depth={depth}
            />
          );
        } else {
          return (
            <div
              key={node.id}
              className="markdown-content-block"
              dangerouslySetInnerHTML={{ __html: node.html || "" }}
            />
          );
        }
      })}
    </>
  );
}

type CollapsibleMarkdownProps = {
  content: string;
};

export default function CollapsibleMarkdown({
  content,
}: CollapsibleMarkdownProps) {
  const tree = useMemo(() => {
    const tokens = marked.lexer(content);
    let nodeIdCounter = 0;

    function createNode(
      type: "heading" | "content",
      tokenArray?: Tokens.Generic[]
    ): MarkdownNode {
      let html = "";
      if (tokenArray && tokenArray.length > 0) {
        html = marked.parser(tokenArray);
      }
      const level =
        tokenArray && tokenArray[0] && "depth" in tokenArray[0]
          ? (tokenArray[0] as Tokens.Heading).depth
          : undefined;
      return {
        type,
        level,
        html,
        children: [],
        id: `node-${nodeIdCounter++}`,
      };
    }

    function buildTree(tokenArray: Tokens.Generic[], startIndex: number = 0): {
      nodes: MarkdownNode[];
      consumed: number;
    } {
      const result: MarkdownNode[] = [];
      let i = startIndex;

      while (i < tokenArray.length) {
        const token = tokenArray[i];
        if (token.type === "heading" && token.depth <= 3) {
          const headingToken = token as Tokens.Heading;
          const headingNode = createNode("heading", [headingToken]);
          i++;
          while (i < tokenArray.length) {
            const nextToken = tokenArray[i];
            if (
              nextToken.type === "heading" &&
              (nextToken as Tokens.Heading).depth <= headingNode.level!
            ) {
              break;
            }

            if (
              nextToken.type === "heading" &&
              (nextToken as Tokens.Heading).depth <= 3
            ) {
              const nestedResult = buildTree(tokenArray, i);
              headingNode.children.push(...nestedResult.nodes);
              i += nestedResult.consumed;
            } else {
              const contentTokens: Tokens.Generic[] = [];
              while (i < tokenArray.length) {
                const contentToken = tokenArray[i];
                if (
                  contentToken.type === "heading" &&
                  (contentToken as Tokens.Heading).depth <= headingNode.level!
                ) {
                  break;
                }
                if (
                  contentToken.type === "heading" &&
                  (contentToken as Tokens.Heading).depth <= 3
                ) {
                  break;
                }
                contentTokens.push(contentToken);
                i++;
              }
              if (contentTokens.length > 0) {
                const contentNode = createNode("content", contentTokens);
                headingNode.children.push(contentNode);
              }
            }
          }

          result.push(headingNode);
        } else {
          const contentTokens: Tokens.Generic[] = [];
          while (i < tokenArray.length) {
            const nextToken = tokenArray[i];
            if (
              nextToken.type === "heading" &&
              (nextToken as Tokens.Heading).depth <= 3
            ) {
              break;
            }
            contentTokens.push(nextToken);
            i++;
          }
          if (contentTokens.length > 0) {
            const contentNode = createNode("content", contentTokens);
            result.push(contentNode);
          }
        }
      }

      return { nodes: result, consumed: i - startIndex };
    }

    const result = buildTree(tokens);
    return result.nodes;
  }, [content]);

  return (
    <div className="collapsible-markdown">
      <CollapsibleMarkdownContent nodes={tree} />
    </div>
  );
}

