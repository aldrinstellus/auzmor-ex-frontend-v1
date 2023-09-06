import { OrgChart } from 'd3-org-chart';
import React, { useEffect, useMemo, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import './index.css';
import UserNode from './UserNode';
import ExpandButtonContent from './ExpandButtonContent';
import UserCard from 'components/UserCard';
import { useOrgChart } from 'queries/users';
import Spinner from 'components/Spinner';
import clsx from 'clsx';

export interface INode {
  id: string;
  parentId: string;
  profileImage?: string;
  userName?: string;
  jobTitle?: string;
  location?: { id: string; name: string };
  department?: { id: string; name: string };
  directReportees?: number;
  matchesCriteria?: boolean;
  _centered?: any;
  _centeredWithDescendants?: any;
  _directSubordinates?: number;
  _expanded?: boolean;
  _totalSubordinates?: number;
  _upToTheRootHighlighted?: boolean;
  _upToTheRootHighlightedNode?: boolean;
}

interface IChart {
  orgChartRef: React.MutableRefObject<OrgChart<any> | null>;
  isLoading: boolean;
  data: INode[];
}

const Chart: React.FC<IChart> = ({ orgChartRef, data, isLoading }) => {
  const chartRef = useRef(null);
  let chart: OrgChart<any> | null = null;
  useEffect(() => {
    if (chartRef.current) {
      if (!chart && data.length) {
        chart = new OrgChart()
          .container(chartRef.current)
          .data(data)
          .nodeHeight((d: any) => 128)
          .nodeWidth((d: any) => 256)
          .compact(false)
          .childrenMargin((d: any) => 50)
          .compactMarginBetween((d: any) => 25)
          .compactMarginPair((d: any) => 50)
          .neightbourMargin((a: any, b: any) => 25)
          .siblingsMargin((d: any) => 25)
          .svgHeight(window.innerHeight - 290)
          .buttonContent(({ node, state }: any) => {
            return renderToString(<ExpandButtonContent node={node} />);
          })
          .nodeContent((node: any, i: any, arr: any, state: any) => {
            return renderToString(<UserNode node={node} />);
          })
          .hoverCardContent((d) => {
            return renderToString(<UserCard user={d.userData} />);
          })
          // .onExpandCollapseClick((d: any, data: any) => {
          //   if (
          //     d.children?.length &&
          //     !(d.children[0].children || d.children[0]._children)
          //   ) {
          //     getOrgChart(chart, {
          //       ids: [...d.children.map((child: any) => child.id)],
          //       limit: 5,
          //       offset: 0,
          //     });
          //   } else {
          //     chart.update(d);
          //   }
          // })
          // .onNodeClick((node: any) => {
          //   if (node.type === NodeType.Count) {
          //     getOrgChart(chart, {
          //       ids: [node.parentId],
          //       limit: 5,
          //       offset: chart.getNodeData(node.parentId)?.data
          //         ?._directSubordinates,
          //       siblingsCount: node.siblingsCount,
          //     });
          //   }
          // })
          .render()
          .expandAll()
          .fit();
        orgChartRef.current = chart;
        return;
      }
    }
  }, [chartRef.current]);

  const loaderStyle = useMemo(
    () =>
      clsx({
        'flex w-full justify-center items-center h-full': true,
        block: isLoading,
        hidden: !isLoading,
      }),
    [isLoading],
  );

  const orgChartContainerStyle = useMemo(
    () =>
      clsx({
        relative: true,
        'opacity-0': isLoading,
        'opacity-100': !isLoading,
      }),
    [isLoading],
  );

  return (
    <>
      <div className={loaderStyle}>
        <Spinner />
      </div>
      <div id="org-chart-container" className={orgChartContainerStyle}>
        <div ref={chartRef} className="h-[calc(100vh-290px)]" />
      </div>
    </>
  );
};

export default Chart;
