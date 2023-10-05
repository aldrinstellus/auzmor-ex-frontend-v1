import { OrgChart } from 'd3-org-chart';
import {
  FC,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { renderToString } from 'react-dom/server';
import './index.css';
import UserNode from './UserNode';
import ExpandButtonContent from './ExpandButtonContent';
import Spinner from 'components/Spinner';
import clsx from 'clsx';
import Button, { Variant } from 'components/Button';
import { IGetUser, UserStatus, getOrgChart } from 'queries/users';
import { QueryFunctionContext } from '@tanstack/react-query';
import { IDesignation } from 'queries/designation';
import { IProfileImage } from 'queries/post';
import { FOCUS_ZOOM, IZoom, MAX_ZOOM, MIN_ZOOM } from '..';
import useAuth from 'hooks/useAuth';
import { mapRanges } from 'utils/misc';

export interface INode {
  id: string;
  parentId: string;
  profileImage?: IProfileImage;
  userName?: string;
  jobTitle?: IDesignation;
  location?: string;
  department?: string;
  directReporteesCount?: number;
  matchesCriteria?: boolean;
  status?: UserStatus;
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
  startWithSpecificUser: IGetUser | null;
  setZoom: (zoom: IZoom) => void;
}

const Chart: FC<IChart> = ({
  orgChartRef,
  data,
  isLoading,
  isFilterApplied,
  onClearFilter,
  startWithSpecificUser,
  setZoom,
}) => {
  const chartRef = useRef(null);
  let chart: any | null = null;
  const { user } = useAuth();
  const [autoSpotlight, setAutoSpotlight] = useState<boolean>(true);
  useEffect(() => {
    if (chartRef.current) {
      if (!chart && data.length) {
        chart = (
          new OrgChart()
            .scaleExtent([MIN_ZOOM, MAX_ZOOM])
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
            .onZoom((zoomScale: number, range: number[]) =>
              setZoom({ zoom: zoomScale, range }),
            )
            .nodeContent((node: any, _i: any, _arr: any, _state: any) => {
              return renderToString(
                <UserNode
                  node={node}
                  isFilterApplied={isFilterApplied && !!!startWithSpecificUser}
                />,
              );
            }) as any
        )
          // .hoverCardContent((d: any) => {
          //   return renderToString(
          //     <UserCard user={d.userData} variant={UsercardVariant.Large} />,
          //   );
          // })
          .onExpandCollapseClick((d: any, _data: any) => {
            if (
              d.data.directReporteesCount > 0 &&
              !!!d.children &&
              !!!d._children
            ) {
              getOrgChart({
                queryKey: [
                  'organization-chart',
                  { root: d.data.id, expand: 0 },
                ],
              } as QueryFunctionContext<any>).then((response: any) => {
                chart?.addNodes(
                  response.data.result.data.filter(
                    (node: any) => node.parentId !== '',
                  ),
                );
                try {
                  const ele = document.getElementById(
                    `expand-btn-${d.data.id}`,
                  );
                  ele?.dispatchEvent(new Event('click'));
                } catch (e) {}
              });
            } else {
              chart?.update(d);
            }
          })
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
          .fit();
        if (autoSpotlight) {
          chart
            .expandAll()
            .render()
            .setFocus(
              user?.id,
              mapRanges(0, 100, MIN_ZOOM, MAX_ZOOM, FOCUS_ZOOM),
            );
          setAutoSpotlight(false);
        } else {
          chart.fit();
        }
        orgChartRef.current = chart;
        return;
      }
    }
  }, [chartRef.current, data, isFilterApplied]);

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
        'relative w-full': true,
        'opacity-0': isLoading || !!!data?.length,
        'opacity-100': !isLoading,
      }),
    [isLoading],
  );

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
