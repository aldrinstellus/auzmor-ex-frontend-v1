import { OrgChart } from 'd3-org-chart';
import { FC, MutableRefObject, useEffect, useMemo, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import './index.css';
import UserNode from './UserNode';
import ExpandButtonContent from './ExpandButtonContent';
import Spinner from 'components/Spinner';
import clsx from 'clsx';
import Button, { Variant } from 'components/Button';

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
  orgChartRef: MutableRefObject<OrgChart<any> | null>;
  isLoading: boolean;
  data: INode[];
  isFilterApplied: boolean;
  onClearFilter: () => void;
}

const Chart: FC<IChart> = ({
  orgChartRef,
  data,
  isLoading,
  isFilterApplied,
  onClearFilter,
}) => {
  const chartRef = useRef(null);
  let chart: OrgChart<any> | null = null;
  useEffect(() => {
    if (chartRef.current) {
      if (!chart && data.length) {
        chart = new OrgChart()
          .container(chartRef.current)
          .data(data)
          .nodeHeight((_d: any) => 128)
          .nodeWidth((_d: any) => 256)
          .compact(false)
          .childrenMargin((_d: any) => 50)
          .compactMarginBetween((_d: any) => 25)
          .compactMarginPair((_d: any) => 50)
          .neightbourMargin((_a: any, _b: any) => 25)
          .siblingsMargin((_d: any) => 25)
          .svgHeight(window.innerHeight - 290)
          .buttonContent(({ node, _state }: any) => {
            return renderToString(<ExpandButtonContent node={node} />);
          })
          .nodeContent((node: any, _i: any, _arr: any, _state: any) => {
            return renderToString(<UserNode node={node} />);
          })
          // .hoverCardContent((d) => {
          //   return renderToString(
          //     <UserCard user={d.userData} variant={UsercardVariant.Large} />,
          //   );
          // })
          // .onExpandCollapseClick((d: any, data: any) => {
          //   if (d.data.directReportees > 0 && !!d.children) {
          //     getOrgChart({
          //       queryKey: [
          //         'organization-chart',
          //         { root: d.data.id, expand: 1 },
          //       ],
          //     } as QueryFunctionContext<any>).then((response: any) => {
          //       response.result.data.users.forEach((node: INode) =>
          //         chart?.addNode(node),
          //       );
          //     });
          //   } else {
          //     chart?.update(d);
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
        'opacity-0': isLoading || !!!data?.length,
        'opacity-100': !isLoading,
      }),
    [isLoading],
  );

  console.log(!!!data?.length);

  return (
    <>
      <div className={loaderStyle}>
        <Spinner />
      </div>
      {!!!data?.length && !!!isLoading && (
        <div className="flex flex-col w-full h-full items-center justify-center bg-white rounded-9xl p-8">
          <div className="mt-8 mb-4">
            <img src={require('images/noResult.png')} />
          </div>
          <div className="text-neutral-900 text-lg font-bold mb-4">
            No result found
          </div>
          <div className="text-neutral-500 text-xs">
            Sorry we can’t find the member you are looking for.
          </div>
          <div className="text-neutral-500 text-xs">
            Please check the spelling or try again.
          </div>
          {isFilterApplied && (
            <Button
              label="Clear filter"
              onClick={onClearFilter}
              className="mt-6"
              variant={Variant.Secondary}
            />
          )}
        </div>
      )}
      <div id="org-chart-container" className={orgChartContainerStyle}>
        <div ref={chartRef} className="h-[calc(100vh-290px)]" />
      </div>
    </>
  );
};

export default Chart;
