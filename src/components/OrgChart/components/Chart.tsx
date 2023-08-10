import { OrgChart } from 'd3-org-chart';
import React, { useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import './index.css';
import UserNode from './UserNode';
import ExpandButtonContent from './ExpandButtonContent';
import UserCard from 'components/UserCard';

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
}

const Chart: React.FC<IChart> = ({ orgChartRef }) => {
  const chartRef = useRef(null);
  let chart: OrgChart<any> | null = null;
  useEffect(() => {
    if (chartRef.current) {
      if (!chart) {
        chart = new OrgChart()
          .container(chartRef.current)
          .data([
            {
              id: 'n1',
              parentId: '',
            },
            {
              id: 'n2',
              parentId: 'n1',
              profileImage:
                'https://office-dev-cdn.auzmor.com/6465d142c62ae5de85d33b81/public/users/64919c3b6e270d84db1bb642/profile/1687760512603-original.jpg',
              userName: 'Owner',
              jobTitle: 'CEO',
              location: { id: '', name: 'United States' },
              department: { id: '', name: 'Marketing' },
              directReportees: 1,
              matchesCriteria: false,
            },
            {
              id: 'n3',
              parentId: 'n2',
              profileImage:
                'https://office-dev-cdn.auzmor.com/6465d142c62ae5de85d33b81/public/users/64919c3b6e270d84db1bb642/profile/1687760512603-original.jpg',
              userName: 'Sub owner',
              jobTitle: 'CEO',
              location: { id: '', name: 'United States' },
              department: { id: '', name: 'Sales' },
              directReportees: 1,
              matchesCriteria: false,
            },
            {
              id: 'n4',
              parentId: 'n3',
              profileImage: '',
              userName: 'Node 4',
              jobTitle: 'CEO',
              location: { id: '', name: 'United States' },
              department: { id: '', name: '' },
              directReportees: 1,
              matchesCriteria: false,
            },
            {
              id: 'n5',
              parentId: 'n4',
              profileImage: '',
              userName: 'Node 5',
              jobTitle: 'CEO',
              location: { id: '', name: 'United States' },
              department: { id: '', name: '' },
              directReportees: 1,
              matchesCriteria: false,
            },
            {
              id: 'n6',
              parentId: 'n5',
              profileImage:
                'https://dhruvinmodi.com/static/media/person.a5a3c610.jpg',
              userName: 'Dhruvin',
              jobTitle: 'CEO',
              location: { id: '', name: 'United States' },
              department: { id: '', name: 'Development' },
              directReportees: 0,
              matchesCriteria: false,
            },
            {
              id: 'n7',
              parentId: 'n5',
              profileImage: '',
              userName: 'Jhonny Depp',
              jobTitle: 'CEO',
              location: { id: '', name: 'United States' },
              department: { id: '', name: 'QA' },
              directReportees: 1,
              matchesCriteria: false,
            },
            {
              id: 'n8',
              parentId: 'n5',
              profileImage: '',
              userName: 'Will smith',
              jobTitle: 'CEO',
              location: { id: '', name: 'United States' },
              department: { id: '', name: 'CI/CD' },
              directReportees: 1,
              matchesCriteria: false,
            },
          ])
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
          // .hoverCardContent(() => renderToString(<UserCard />))
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

  return (
    <div id="org-chart-container" className="relative">
      <div ref={chartRef} className="h-[calc(100vh-290px)]" />
    </div>
  );
};

export default Chart;
